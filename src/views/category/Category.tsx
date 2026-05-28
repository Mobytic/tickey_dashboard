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
import { apiCategoryIndex, apiCategoryDelete } from '@/services/categoryService'
import type { Category } from '@/@types/category'
import CategoryForm from './CategoryForm'

const { Tr, Th, Td, THead, TBody } = Table

const Category = () => {
    // 1. LES ÉTATS (DONNÉES)
    const [data, setData] = useState<Category[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // 2. FONCTION DE CHARGEMENT DES DONNÉES
    const fetchCategories = async () => {
        try {
            const response = await apiCategoryIndex()
            setData(response.data) // AdonisJS renvoie un tableau direct ici grâce à response.ok(categories)
        } catch (error) {
            console.error('Erreur de récupération', error)
            toast.push(<Notification type="danger">Erreur de connexion au serveur</Notification>, { placement: 'top-end' })
        }
    }

    // Chargement initial au montage de la page
    useEffect(() => {
        fetchCategories()
    }, [])

    // 3. GESTION DE LA BOÎTE DE DIALOGUE
    const openAddDialog = () => {
        setSelectedCategory(null) // On vide pour être en mode Création
        setDialogIsOpen(true)
    }

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category) // On remplit pour être en mode Modification
        setDialogIsOpen(true)
    }

    const closeDialogAndRefresh = () => {
        setDialogIsOpen(false)
        fetchCategories() // On met à jour le tableau immédiatement !
    }

    // 4. GESTION DE LA SUPPRESSION
    const handleDelete = async (id: number) => {
        // Petite sécurité native JavaScript avant de supprimer
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            try {
                const response = await apiCategoryDelete(id)
                toast.push(<Notification type="success">{response.data.message}</Notification>, { placement: 'top-end' })
                fetchCategories() // On rafraîchit le tableau
            } catch (error) {
                toast.push(<Notification type="danger">Impossible de supprimer la catégorie.</Notification>, { placement: 'top-end' })
            }
        }
    }

    // 5. DÉFINITION DES COLONNES DU TABLEAU
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
                        <button
                            className="text-blue-500 hover:underline font-semibold"
                            onClick={() => openEditDialog(category)}
                        >
                            Modifier
                        </button>
                        <button
                            className="text-red-500 hover:underline font-semibold"
                            onClick={() => handleDelete(category.id)}
                        >
                            Supprimer
                        </button>
                    </div>
                )
            },
        },
    ], [])

    // 6. INITIALISATION DE TANSTACK TABLE
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // 7. RENDU VISUEL
    return (
        <div>
            {/* EN-TÊTE : Titre + Bouton Ajouter */}
            <div className="flex justify-between items-center mb-6">
                <h3>Gestion des Catégories</h3>
                <Button variant="solid" onClick={openAddDialog}>
                    + Ajouter une catégorie
                </Button>
            </div>

            {/* LE TABLEAU */}
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

            {/* LA BOÎTE DE DIALOGUE (Invisible par défaut) */}
            <Dialog
                isOpen={dialogIsOpen}
                onClose={() => setDialogIsOpen(false)}
                onRequestClose={() => setDialogIsOpen(false)}
            >
                <div className="p-4">
                    <h5 className="mb-4">
                        {selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                    </h5>
                    
                    {/* LE FORMULAIRE EST INCLUS ICI */}
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