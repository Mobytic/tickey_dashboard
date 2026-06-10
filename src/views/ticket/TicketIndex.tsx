import { useState, useEffect, useMemo } from 'react'
import { 
    flexRender, 
    getCoreRowModel, 
    getPaginationRowModel,
    useReactTable, 
    ColumnDef 
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import { Notification, toast } from '@/components/ui'
import { useAppSelector } from '@/store'
import { apiTicketIndex } from '@/services/ticketService'
import type { Ticket } from '@/@types/ticket'
import TicketForm from './TicketForm'
import { UserRole } from '@/@types/auth'
import TicketShow from './TicketShow'
import ActionButton from '@/components/ui/Button/ActionButton'

const { Tr, Th, Td, THead, TBody } = Table

const TicketList = () => {
    const [rawTickets, setRawTickets] = useState<Ticket[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isShowOpen, setIsShowOpen] = useState(false)
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

    const openEditDialog = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setIsFormOpen(true)
    }

    const openShowDialog = (ticket: Ticket) => {
        setSelectedTicket(ticket)
        setIsShowOpen(true)
    }

    const closeFormAndRefresh = () => {
        setIsFormOpen(false)
        fetchTickets()
    }

    const columns = useMemo<ColumnDef<Ticket>[]>(() => {
        const baseColumns: ColumnDef<Ticket>[] = [
            { 
                header: 'Date', 
                id: 'createdAt',
                cell: (props) => new Date(props.row.original.createdAt).toLocaleDateString('fr-FR')
            },
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
                header: 'Site Web', 
                id: 'website',
                cell: (props) => props.row.original.website?.url || '-' 
            },
        ]
  
        if (isAdmin) {
            baseColumns.push({
                header: 'Tag',
                id: 'nametag',
                cell: (props) => {
                    const tags = props.row.original.nametags || []
                    if (tags.length === 0) {
                        return <span className="text-gray-400">-</span>
                    }
                    return (
                        <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                                <span 
                                    key={tag.id}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border transition-transform hover:scale-105"
                                    style={{ 
                                        backgroundColor: `${tag.color}15`,
                                        borderColor: `${tag.color}40`,
                                        color: tag.color 
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )
                }
            })
        }

        baseColumns.push({
            header: 'Actions',
            id: 'actions',
            cell: (props) => {
                const ticket = props.row.original
                return (
                    <div className="flex gap-3">
                        <ActionButton 
                            type="edit" 
                            onClick={() => openEditDialog(ticket)} 
                        />
                        <ActionButton 
                            type="view" 
                            onClick={() => openShowDialog(ticket)} 
                        />
                    </div>
                )
            }
        })

        return baseColumns
    }, [isAdmin])

    const table = useReactTable({
        data: rawTickets,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        },
    })

    const { pageIndex, pageSize } = table.getState().pagination

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2>Gestion des Tickets</h2>
                </div>
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


            {rawTickets.length > 0 && (
                <div className="flex justify-end mt-5">
                    <Pagination
                        total={rawTickets.length}
                        pageSize={pageSize}
                        currentPage={pageIndex + 1}
                        onChange={(page) => table.setPageIndex(page - 1)}
                    />
                </div>
            )}

            <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRequestClose={() => setIsFormOpen(false)} width={800}>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    <h3 className="mb-4">{selectedTicket ? 'Modifier le ticket' : 'Créer un nouveau ticket'}</h3>
                    <TicketForm initialData={selectedTicket} onSuccess={closeFormAndRefresh} />
                </div>
            </Dialog>

            <Dialog isOpen={isShowOpen} onClose={() => setIsShowOpen(false)} onRequestClose={() => setIsShowOpen(false)} width={700}>
                <div className="p-4">
                    <h3 className="mb-5">Détails du Ticket #{selectedTicket?.id}</h3>
                    {selectedTicket && <TicketShow ticket={selectedTicket} />}
                </div>
            </Dialog>
        </div>
    )
}

export default TicketList