import { useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import type { User } from '@/@types/auth'
import { apiUserIndex } from '@/services/authService'


const columns: ColumnDef<User>[] = [
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
        header: 'Sites internet',
        accessorKey: 'websites.url',
    },
]


const { Tr, Th, Td, THead, TBody, Sorter } = Table

const UserIndex = () => {
    const [sorting, setSorting] = useState<ColumnSort[]>([])
    const [data, setData] = useState<User[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiUserIndex()
                setData(response.data)
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs', error)
            }
        }
        fetchUsers()
    }, [])

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
        <>
        <h3>Liste des utilisateurs</h3>
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
        </>
    )
}

export default UserIndex
