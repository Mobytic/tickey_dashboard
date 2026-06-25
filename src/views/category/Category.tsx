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
import { apiCategoryIndex, apiCategoryDelete } from '@/services/CategoryService'
import type { Category } from '@/@types/category'
import CategoryForm from './CategoryForm'
import ActionButton from '@/components/ui/Button/ActionButton'

const { Tr, Th, Td, THead, TBody } = Table

const Category = () => {

    const [data, setData] = useState<Category[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const fetchCategories = async () => {
        try {
            const response = await apiCategoryIndex()
            setData(response.data)
        } catch (error) {
            console.error('Erreur de récupération', error)
            toast.push(<Notification type="danger">Erreur de connexion au serveur</Notification>, { placement: 'top-end' })
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const openAddDialog = () => {
        setSelectedCategory(null)
        setDialogIsOpen(true)
    }

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category)
        setDialogIsOpen(true)
    }

    const closeDialogAndRefresh = () => {
        setDialogIsOpen(false)
        fetchCategories()
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.')) {
            try {
                const response = await apiCategoryDelete(id)
                toast.push(<Notification type="success">{response.data.message}</Notification>, { placement: 'top-end' })
                fetchCategories() 
            } catch (error) {
                toast.push(<Notification type="danger">Impossible de supprimer la catégorie.</Notification>, { placement: 'top-end' })
            }
        }
    }

    const columns = useMemo<ColumnDef<Category>[]>(() => [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Nom de la catégorie',
            accessorKey: 'name',
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (props) => {
                const category = props.row.original
                return (
                    <div className="flex gap-4">
                        <ActionButton 
                            type="edit" 
                            onClick={() => openEditDialog(category)} 
                        />
                        <ActionButton 
                            type="delete" 
                            onClick={() => handleDelete(category.id)} 
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
                <h2>Gestion des Catégories</h2>
                <Button variant="solid" onClick={openAddDialog}>
                    + Ajouter une catégorie
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
                        {selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                    </h3>
                    
                    <CategoryForm 
                        initialData={selectedCategory} 
                        onSuccess={closeDialogAndRefresh} 
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default Category