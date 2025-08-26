"use client"

import { Action } from "@/types/action"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"

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
export const columns: ColumnDef<Action>[] = [
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
        accessorKey: "canInterrupt",
        header: () => (
            <span className="flex items-center gap-1 font-semibold">
                Can Interrupt
            </span>
        ),
        cell: ({ row }) => {
            const canInterrupt = row.original.canInterrupt;
            return canInterrupt ? (
                <span className="inline-flex items-center text-green-600 font-medium">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Yes
                </span>
            ) : (
                <span className="inline-flex items-center text-gray-400 font-medium" title="Không thể ngắt">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    No
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

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
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]