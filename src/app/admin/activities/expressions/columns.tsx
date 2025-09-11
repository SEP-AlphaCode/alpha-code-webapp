"use client"

import { Expression } from "@/types/expression"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const createColumns = (
  onEdit?: (expression: Expression) => void, 
  onDelete?: (expression: Expression) => void,
  onView?: (expression: Expression) => void
): ColumnDef<Expression>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: () => (
            <span className="flex items-center gap-1 text-gray-700 font-semibold">
                ID
            </span>
        ),
        cell: ({ row }) => (
            <span className="text-gray-700 font-semibold">
                {row.original.id.substring(0, 8)}...
            </span>
        ),
    },
    {
        accessorKey: "code",
        header: () => (
            <span className="flex items-center gap-1 text-blue-700 font-semibold">
                Code
            </span>
        ),
        cell: ({ row }) => (
            <span className="text-blue-700 font-mono bg-blue-50 px-2 py-1 rounded text-sm">
                {row.original.code}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <span className="flex items-center gap-1 text-purple-700 font-semibold">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 h-auto min-w-0 font-semibold"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </span>
        ),
    },
    {
        accessorKey: "imageUrl",
        header: () => (
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                Image
            </span>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1 text-blue-600 font-medium">
                {row.original.imageUrl ? (
                    <Image 
                        src={row.original.imageUrl} 
                        alt="Expression" 
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <span className="text-gray-400">No image</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: () => (
            <span className="flex items-center gap-1 text-green-700 font-semibold">
                Status
            </span>
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            let color = "bg-gray-200 text-gray-700";
            let text = "Unknown";
            let icon = null;
            if (status === 1) {
                color = "bg-green-100 text-green-700";
                text = "Active";
                icon = <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>;
            } else if (status === 0) {
                color = "bg-red-100 text-red-700";
                text = "Inactive";
                icon = <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>;
            }
            return (
                <span className={`inline-flex items-center px-2 py-1 rounded ${color} font-semibold text-xs`}>
                    {icon}
                    {text}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const expression = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(expression.id)}
                            className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            Copy Expression ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => onView?.(expression)}
                            className="hover:bg-green-50 hover:text-green-700 transition-all duration-200 cursor-pointer group"
                        >
                            <Eye className="mr-2 h-4 w-4 text-gray-600 group-hover:text-green-600 group-hover:scale-110 transition-all duration-200" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onEdit?.(expression)}
                            className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer group"
                        >
                            <Edit className="mr-2 h-4 w-4 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200" />
                            Edit Expression
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete?.(expression)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer group"
                        >
                            <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200" />
                            Delete Expression
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
