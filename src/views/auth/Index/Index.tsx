import { useState, useEffect, useMemo } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import Button from '@/components/ui/Button'
import type { User } from '@/@types/auth'
import { apiUserIndex } from '@/services/authService'
import Dialog from '@/components/ui/Dialog'
import SignUpForm from '@/views/auth/SignUp/SignUpForm'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const UserIndex = () => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<User[]>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const openDialog = (user: User) => {
        setSelectedUser(user)
        setDialogIsOpen(true)
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
                    <button
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                        onClick={() => openDialog(user)}
                    >
                        Modifier
                    </button>
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
                <h3>Liste des utilisateurs</h3>
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
            
            <Dialog
                isOpen={dialogIsOpen}
                onClose={closeDialog}
                onRequestClose={closeDialog}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Modifier l'utilisateur</h5>
                    <div className="max-h-[70vh] overflow-y-auto">
                        <SignUpForm 
                            initialData={selectedUser} 
                            onSuccess={closeDialog}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default UserIndex