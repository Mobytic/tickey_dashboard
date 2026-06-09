import { useState, useEffect } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import DraggableWrapper from '@/components/ui/dnd/Draggable'
import DroppableWrapper from '@/components/ui/dnd/Droppable'
import { apiTicketIndex, apiTicketUpdate } from '@/services/ticketService'
import { Notification, toast } from '@/components/ui'
import type { Ticket, TicketRequest } from '@/@types/ticket'
import TicketCard from '@/components/ui/DnD/TicketCard'

// Définition de nos colonnes avec l'ID du statut correspondant en base de données
const BOARD_COLUMNS = [
    { id: '1', title: 'À faire' },
    { id: '2', title: 'En cours' },
    { id: '3', title: 'En attente' },
    { id: '4', title: 'Fait' },
]

// Type pour notre état local : un dictionnaire avec l'ID du statut comme clé
type ColumnsState = Record<string, Ticket[]>

const Home = () => {
    const [columns, setColumns] = useState<ColumnsState>({
        '1': [], '2': [], '3': [], '4': []
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchBoardTickets = async () => {
        try {
            const response = await apiTicketIndex()
            const allTickets = response.data

            // On prépare un objet vide pour trier nos tickets
            const sortedColumns: ColumnsState = {
                '1': [], '2': [], '3': [], '4': []
            }

            // On range chaque ticket dans sa colonne (par défaut '1' si non défini)
            allTickets.forEach((ticket) => {
                const statusId = String(ticket.ticketStatusId || '1')
                if (sortedColumns[statusId]) {
                    sortedColumns[statusId].push(ticket)
                }
            })

            // Règle spécifique : On limite la colonne "Fait" (ID 4) aux 10 derniers tickets mis à jour
            sortedColumns['4'] = sortedColumns['4']
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 10)

            setColumns(sortedColumns)
        } catch (error) {
            console.error('Erreur lors du chargement des tickets', error)
            toast.push(<Notification type="danger">Impossible de charger les tickets</Notification>, { placement: 'top-end' })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBoardTickets()
    }, [])

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result

        // 1. Si on lâche le ticket en dehors d'une zone droppable, on annule.
        if (!destination) return

        // 2. Si on le lâche exactement au même endroit, on annule.
        if (source.droppableId === destination.droppableId && source.index === destination.index) return

        // --- MISE À JOUR VISUELLE (Optimistic UI) ---
        const sourceColId = source.droppableId
        const destColId = destination.droppableId

        // On clone les tableaux de la colonne de départ et d'arrivée pour ne pas muter l'état directement
        const startTickets = Array.from(columns[sourceColId])
        const destTickets = sourceColId === destColId ? startTickets : Array.from(columns[destColId])

        // On retire le ticket de sa colonne d'origine
        const [movedTicket] = startTickets.splice(source.index, 1)
        
        // On met à jour l'ID du statut du ticket pour qu'il corresponde à sa nouvelle colonne
        movedTicket.ticketStatusId = Number(destColId)

        // On insère le ticket dans sa nouvelle colonne, à son nouvel index
        destTickets.splice(destination.index, 0, movedTicket)

        // Règle de la limite à 10 pour la colonne "Fait" lors du Drag & Drop
        if (destColId === '4' && destTickets.length > 10) {
             destTickets.pop() // Enlève le plus ancien si on dépasse 10
        }

        // On met à jour l'état visuel instantanément
        setColumns((prev) => ({
            ...prev,
            [sourceColId]: startTickets,
            [destColId]: destTickets,
        }))

        // --- MISE À JOUR EN BASE DE DONNÉES ---
        try {
            // Reconstitution du payload requis par l'API pour l'update
            const updatePayload: TicketRequest = {
                title: movedTicket.title,
                bugLink: movedTicket.bugLink,
                clientComment: movedTicket.clientComment,
                teamComment: movedTicket.teamComment || '',
                mailComment: movedTicket.mailComment || '',
                categoryId: movedTicket.categoryId,
                websiteId: movedTicket.websiteId,
                statusId: Number(destColId), // C'est ici qu'on change vraiment le statut
                nametagIds: movedTicket.nametags?.map(tag => tag.id) || [],
            }

            await apiTicketUpdate(movedTicket.id, updatePayload)
            toast.push(<Notification type="success">Statut mis à jour !</Notification>, { placement: 'top-end' })
        } catch (error) {
            // En cas d'erreur serveur, on recharge les données pour remettre le ticket à sa place initiale
            toast.push(<Notification type="danger">Erreur de sauvegarde, annulation...</Notification>, { placement: 'top-end' })
            fetchBoardTickets() 
        }
    }

    if (isLoading) return <div className="p-6">Chargement du tableau...</div>

    return (
        <div className="p-6">
            <h3 className="mb-6">Tableau de bord</h3>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {BOARD_COLUMNS.map((column) => (
                        <div key={column.id} className="flex flex-col h-full">
                            <h5 className="mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
                                {column.title} <span className="text-xs text-gray-400 font-normal ml-2">({columns[column.id]?.length || 0})</span>
                            </h5>
                            
                            <DroppableWrapper id={column.id}>
                                {columns[column.id]?.map((ticket, index) => (
                                    <DraggableWrapper key={ticket.id} id={String(ticket.id)} index={index}>
                                        <TicketCard ticket={ticket} onRefresh={fetchBoardTickets} />
                                    </DraggableWrapper>
                                ))}
                            </DroppableWrapper>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}

export default Home