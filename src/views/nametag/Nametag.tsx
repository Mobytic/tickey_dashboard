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
import { apiNametagIndex, apiNametagDelete } from '@/services/NametagService'
import type { Nametag } from '@/@types/Nametag'
import NametagForm from './NametagForm'
import ColorIndicator from '@/components/ui/Nametag/ColorIndicator'
import ActionButton from '@/components/ui/Button/ActionButton'

const { Tr, Th, Td, THead, TBody } = Table

const Nametag = () => {

    const [data, setData] = useState<Nametag[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedNametag, setSelectedNametag] = useState<Nametag | null>(null)

    const fetchNametags = async () => {
        try {
            const response = await apiNametagIndex()
            setData(response.data)
        } catch (error) {
            console.error('Erreur de récupération', error)
            toast.push(<Notification type="danger">Erreur de connexion au serveur</Notification>, { placement: 'top-end' })
        }
    }

    useEffect(() => {
        fetchNametags()
    }, [])


    const openAddDialog = () => {
        setSelectedNametag(null)
        setDialogIsOpen(true)
    }

    const openEditDialog = (nametag: Nametag) => {
        setSelectedNametag(nametag)
        setDialogIsOpen(true)
    }

    const closeDialogAndRefresh = () => {
        setDialogIsOpen(false)
        fetchNametags()
    }

    const handleDelete = async (id: number) => {

        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce nametag ?')) {
            try {
                const response = await apiNametagDelete(id)
                toast.push(<Notification type="success">{response.data.message}</Notification>, { placement: 'top-end' })
                fetchNametags()
            } catch (error) {
                toast.push(<Notification type="danger">Impossible de supprimer le nametag.</Notification>, { placement: 'top-end' })
            }
        }
    }

    const columns = useMemo<ColumnDef<Nametag>[]>(() => [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Nom',
            accessorKey: 'name',
        },
        {
            header: 'Couleur',
            accessorKey: 'color',
            cell: (props) => {
                const colorValue = props.getValue<string>()
                return <ColorIndicator color={colorValue} />
            }
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (props) => {
                const nametag = props.row.original
                return (
                    <div className="flex gap-4">
                        <ActionButton 
                            type="edit" 
                            onClick={() => openEditDialog(nametag)} 
                        />
                        <ActionButton 
                            type="delete" 
                            onClick={() => handleDelete(nametag.id)} 
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
                <h2>Gestion des Nametags</h2>
                <Button variant="solid" onClick={openAddDialog}>
                    + Ajouter un Nametag
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
                    <h3 className="mb-4">
                        {selectedNametag ? 'Modifier le Nametag' : 'Nouveau Nametag'}
                    </h3>
                    
                    <NametagForm 
                        initialData={selectedNametag} 
                        onSuccess={closeDialogAndRefresh} 
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default Nametag