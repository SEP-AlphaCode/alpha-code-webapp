"use client"

import { Dance } from "@/types/dance"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

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
  onEdit?: (dance: Dance) => void, 
  onDelete?: (dance: Dance) => void,
  onView?: (dance: Dance) => void
): ColumnDef<Dance>[] => [
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
        accessorKey: "description",
        header: () => (
            <span className="flex items-center gap-1 text-yellow-700 font-semibold">
                <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M8 16h8M8 8h8" /></svg>
                Description
            </span>
        ),
    },
    {
        accessorKey: "duration",
        header: () => (
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                Duration
            </span>
        ),
        cell: ({ row }) => (
            <span className="flex items-center gap-1 text-blue-600 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {row.original.duration}s
            </span>
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
            const dance = row.original

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
                            onClick={() => navigator.clipboard.writeText(dance.id)}
                            className="hover:bg-gray-100 transition-colors duration-200"
                        >
                            Copy Dance ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => onView?.(dance)}
                            className="hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onEdit?.(dance)}
                            className="hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Dance
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete?.(dance)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Dance
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
