import { useState, useEffect, useMemo } from 'react'
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Notification, toast } from '@/components/ui'
import { useAppSelector } from '@/store'
import { apiTicketIndex } from '@/services/ticketService'
import type { Ticket } from '@/@types/ticket'
import TicketForm from './TicketForm'
import { UserRole } from '@/@types/auth'

const { Tr, Th, Td, THead, TBody } = Table

const TicketList = () => {
    const [rawTickets, setRawTickets] = useState<Ticket[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

    const user = useAppSelector((state) => state.auth.user)
    const isAdmin = user?.authority?.includes(UserRole.admin)

    const fetchTickets = async () => {
        try {
            const response = await apiTicketIndex()
            setRawTickets(response.data)
        } catch (error) {
            console.error('Erreur de récupération des tickets', error)
            toast.push(<Notification type="danger">Erreur serveur lors du chargement</Notification>, { placement: 'top-end' })
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const visibleTickets = useMemo(() => {
        if (isAdmin) {
            return rawTickets
        }
        return rawTickets.filter((ticket) => ticket.userId === user?.id)
    }, [rawTickets, isAdmin, user?.id])

    const openAddDialog = () => {
        setSelectedTicket(null)
        setDialogIsOpen(true)
    }

    const openEditDialog = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setDialogIsOpen(true)
    }

    const closeDialogAndRefresh = () => {
        setDialogIsOpen(false)
        fetchTickets()
    }

    const columns = useMemo<ColumnDef<Ticket>[]>(() => {
        const baseColumns: ColumnDef<Ticket>[] = [
            { header: 'ID', accessorKey: 'id' },
            { header: 'Titre', accessorKey: 'title' },
            { 
                header: 'Catégorie', 
                id: 'category',
                cell: (props) => props.row.original.category?.name || 'Non défini'
            },
            { 
                header: 'Statut', 
                id: 'status',
                cell: (props) => props.row.original.status?.name || 'Non défini'
            },
            { 
                header: 'Tag', 
                id: 'nametag',
                cell: (props) => props.row.original.nametags?.[0]?.name || '-'
            }
        ]

        if (isAdmin) {
            baseColumns.push({
                header: 'Créé par',
                id: 'creator',
                cell: (props) => {
                    const creator = props.row.original.user
                    return creator ? `${creator.firstname} ${creator.lastname}` : `Utilisateur #${props.row.original.userId}`
                }
            })
        }

        baseColumns.push({
            header: 'Actions',
            id: 'actions',
            cell: (props) => {
                const ticket = props.row.original
                const canModify = isAdmin || ticket.userId === user?.id

                if (!canModify) {
                    return <span className="text-gray-400 text-xs italic">Lecture seule</span>
                }

                return (
                    <button
                        className="text-blue-500 hover:underline font-semibold text-sm"
                        onClick={() => openEditDialog(ticket)}
                    >
                        Modifier
                    </button>
                )
            }
        })

        return baseColumns
    }, [isAdmin, user?.id])

    const table = useReactTable({
        data: visibleTickets,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3>Gestion des Tickets</h3>
                </div>
                <Button variant="solid" onClick={openAddDialog}>
                    + Ouvrir un ticket
                </Button>
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={columns.length} className="text-center py-6 text-gray-400">
                                Aucun ticket à afficher.
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>

            <Dialog isOpen={dialogIsOpen} onClose={() => setDialogIsOpen(false)} onRequestClose={() => setDialogIsOpen(false)}>
                <div className="p-4">
                    <h5 className="mb-4">
                        {selectedTicket ? 'Modifier le ticket' : 'Créer un nouveau ticket'}
                    </h5>
                    <TicketForm initialData={selectedTicket} onSuccess={closeDialogAndRefresh} />
                </div>
            </Dialog>
        </div>
    )
}

export default TicketList