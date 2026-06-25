import { useState, useEffect, useMemo } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import type { User } from '@/@types/auth'
import { apiAuthDelete, apiUserIndex } from '@/services/AuthService'
import Dialog from '@/components/ui/Dialog'
import SignUpForm from '@/views/auth/SignUp/SignUpForm'
import ActionButton from '@/components/ui/Button/ActionButton'
import UserShow from './userShow'
import { Notification, toast } from '@/components/ui'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const UserIndex = () => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<User[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [isShowOpen, setIsShowOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const openEditDialog = (user: User) => {
        setSelectedUser(user)
        setDialogIsOpen(true)
    }

    const openShowDialog = (user: User) => {
        setSelectedUser(user)
        setIsShowOpen(true)
    }

    const closeDialog = () => {
        setDialogIsOpen(false)
        setSelectedUser(null)
        fetchUsers()
    }

    const fetchUsers = async () => {
        try {
            const response = await apiUserIndex()
            setData(response.data)
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error)
        }
    }

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et entrainera la suppression de ses sites webs et tickets associés')) {
            try {
                const response = await apiAuthDelete(id)
                toast.push(<Notification type="success">{response.data.message}</Notification>, { placement: 'top-end' })
                fetchUsers()
            } catch (error) {
                toast.push(<Notification type="danger">Impossible de supprimer cet utilisateur.</Notification>, { placement: 'top-end' })
            }
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])


    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            header: 'Prénom',
            accessorKey: 'firstname',
        },
        {
            header: 'Nom',
            accessorKey: 'lastname',
        },
        {
            header: 'Entreprise',
            accessorKey: 'companyName',
        },
        {
            header: 'Adresse Mail',
            accessorKey: 'mail',
        },
        {
            header: 'Téléphone',
            accessorKey: 'tel',
        },
        {
            header: 'Sites internet',
            id: 'websites',
            cell: (props) => {
                const websites = props.row.original.websites;
                if (!websites || websites.length === 0) {
                    return <span className="text-gray-400">-</span>;
                }
                return (
                    <div className="flex flex-col gap-1">
                        {websites.map((site, index) => (
                            <a 
                                key={index} 
                                href={site.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
                            >
                                {site.url}
                            </a>
                        ))}
                    </div>
                );
            },
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (props) => {
                const user = props.row.original;
                return (
                    <div className="flex gap-4">
                        <ActionButton 
                            type="edit" 
                            onClick={() => openEditDialog(user)} 
                        />
                        <ActionButton 
                            type="view" 
                            onClick={() => openShowDialog(user)} 
                        />
                        <ActionButton 
                            type="delete" 
                            onClick={() => handleDelete(user.id)} 
                        />
                    </div>
                );
            },
        },
    ], [])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2>Liste des utilisateurs</h2>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                }
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table
                        .getRowModel()
                        .rows
                        .map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                </TBody>
            </Table>
            
            <Dialog isOpen={dialogIsOpen} onClose={closeDialog} onRequestClose={closeDialog} width={800}>
                <div className="p-4 max-h-[80vh] overflow-y-auto">
                    <h3 className="mb-4">Modifier l'utilisateur</h3>
                    <SignUpForm initialData={selectedUser} onSuccess={closeDialog}/>
                </div>
            </Dialog>

            <Dialog isOpen={isShowOpen} onClose={() => setIsShowOpen(false)} onRequestClose={() => setIsShowOpen(false)} width={700}>
                <div className="p-4">
                    <h3 className="mb-5">Détails de l'utilisateur #{selectedUser?.id}</h3>
                    {selectedUser && <UserShow user={selectedUser} />}
                </div>
            </Dialog>
        </div>
    )
}

export default UserIndex