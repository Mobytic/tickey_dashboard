import { useState, useEffect, useMemo } from 'react'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Notification, toast } from '@/components/ui'
import { apiTicketStatusIndex, apiTicketStatusDelete } from '@/services/TicketStatusService'
import type { TicketStatus } from '@/@types/TicketStatus'
import StatusForm from './StatusForm'
import ActionButton from '@/components/ui/Button/ActionButton'

const { Tr, Th, Td, THead, TBody } = Table

const Status = () => {

    const [data, setData] = useState<TicketStatus[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedTicketStatus, setSelectedTicketStatus] = useState<TicketStatus | null>(null)


    const fetchStatuses = async () => {
        try {
            const response = await apiTicketStatusIndex()
            setData(response.data)
        } catch (error) {
            console.error('Erreur de récupération', error)
            toast.push(<Notification type="danger">Erreur de connexion au serveur</Notification>, { placement: 'top-end' })
        }
    }

    useEffect(() => {
        fetchStatuses()
    }, [])

    const openAddDialog = () => {
        setSelectedTicketStatus(null)
        setDialogIsOpen(true)
    }

    const openEditDialog = (ticketStatus: TicketStatus) => {
        setSelectedTicketStatus(ticketStatus)
        setDialogIsOpen(true)
    }

    const closeDialogAndRefresh = () => {
        setDialogIsOpen(false)
        fetchStatuses()
    }


    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce statut ?')) {
            try {
                const response = await apiTicketStatusDelete(id)
                toast.push(<Notification type="success">{response.data.message}</Notification>, { placement: 'top-end' })
                fetchStatuses()
            } catch (error) {
                toast.push(<Notification type="danger">Impossible de supprimer ce statut.</Notification>, { placement: 'top-end' })
            }
        }
    }

    const columns = useMemo<ColumnDef<TicketStatus>[]>(() => [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Titre du statut',
            accessorKey: 'name',
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (props) => {
                const ticketStatus = props.row.original
                return (
                    <div className="flex gap-4">
                        <ActionButton 
                            type="edit" 
                            onClick={() => openEditDialog(ticketStatus)} 
                        />
                        <ActionButton 
                            type="delete" 
                            onClick={() => handleDelete(ticketStatus.id)} 
                        />
                    </div>
                )
            },
        },
    ], [])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3>Gestion des Statuts</h3>
                <Button variant="solid" onClick={openAddDialog}>
                    + Ajouter un statut
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
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>

            <Dialog
                isOpen={dialogIsOpen}
                onClose={() => setDialogIsOpen(false)}
                onRequestClose={() => setDialogIsOpen(false)}
            >
                <div className="p-4">
                    <h5 className="mb-4">
                        {selectedTicketStatus ? 'Modifier le statut' : 'Nouveau statut'}
                    </h5>
                    
                    <StatusForm 
                        initialData={selectedTicketStatus} 
                        onSuccess={closeDialogAndRefresh} 
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default Status