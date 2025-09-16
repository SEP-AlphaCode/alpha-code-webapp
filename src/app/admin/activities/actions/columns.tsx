"use client"

import { Action } from "@/types/action"
import { ColumnDef, Column } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

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

// Helper function to format duration from milliseconds
const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    let result = "";
    if (minutes > 0) result += `${minutes}m`;
    if (seconds > 0) result += `${result ? " " : ""}${seconds}s`;
    if (milliseconds > 0) result += `${result ? " " : ""}${milliseconds}ms`;
    return result.trim();
};

// Header cell components
const HeaderCell = ({ children }: { children: React.ReactNode }) => {
    const { t, isLoading } = useAdminTranslation()
    // if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-gray-700 font-semibold">
            {children}
        </span>
    )
}

const CodeHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-blue-700 font-semibold">
            {t('actionManagement.fields.code')}
        </span>
    )
}

const NameHeaderCell = ({ column }: { column: Column<Action, unknown> }) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-purple-700 font-semibold">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 h-auto min-w-0 font-semibold"
            >
                {t('actionManagement.fields.name')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </span>
    )
}

const DescriptionHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-yellow-700 font-semibold">
            <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M8 16h8M8 8h8" /></svg>
            {t('actionManagement.fields.description')}
        </span>
    )
}

const DurationHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-blue-600 font-semibold">
            {t('actionManagement.fields.duration')}
        </span>
    )
}

const StatusHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-green-700 font-semibold">
            {t('actionManagement.fields.status')}
        </span>
    )
}

const CanInterruptHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 font-semibold">
            {t('actionManagement.fields.canInterrupt')}
        </span>
    )
}

// Cell components
const DescriptionCell = ({ description }: { description?: string }) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    
    return (
        <div className="max-w-xs">
            <p className="text-sm text-gray-700 line-clamp-5 whitespace-normal break-words">
                {description || t('common.noData')}
            </p>
        </div>
    )
}

const StatusCell = ({ status }: { status: number }) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    
    let color = "bg-gray-200 text-gray-700";
    let text = t('common.unknown');
    let icon = null;
    
    if (status === 1) {
        color = "bg-green-100 text-green-700";
        text = t('common.active');
        icon = <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>;
    } else if (status === 0) {
        color = "bg-red-100 text-red-700";
        text = t('common.inactive');
        icon = <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>;
    }
    
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded ${color} font-semibold text-xs`}>
            {icon}
            {text}
        </span>
    )
}

const CanInterruptCell = ({ canInterrupt }: { canInterrupt: boolean }) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    
    return canInterrupt ? (
        <span className="inline-flex items-center text-green-600 font-medium">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {t('common.yes')}
        </span>
    ) : (
        <span className="inline-flex items-center text-gray-400 font-medium">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {t('common.no')}
        </span>
    )
}

const ActionCell = ({ 
    action, 
    onEdit, 
    onDelete, 
    onView 
}: { 
    action: Action
    onEdit?: (action: Action) => void
    onDelete?: (action: Action) => void
    onView?: (action: Action) => void
}) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{t('common.actions')}</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(action.id)}>
                    {t('common.copyId')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onView?.(action)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t('common.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(action)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.editItem')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onDelete?.(action)}
                    className="text-red-600 focus:text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.deleteItem')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const createColumns = (
  onEdit?: (action: Action) => void, 
  onDelete?: (action: Action) => void,
  onView?: (action: Action) => void
): ColumnDef<Action>[] => [
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
        header: () => <HeaderCell>ID</HeaderCell>,
        cell: ({ row }) => (
            <span className="text-gray-700 font-semibold">
                {row.original.id.substring(0, 8)}...
            </span>
        ),
    },
    {
        accessorKey: "code",
        header: () => <CodeHeaderCell />,
        cell: ({ row }) => (
            <span className="text-blue-700 font-mono bg-blue-50 px-2 py-1 rounded text-sm">
                {row.original.code}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => <NameHeaderCell column={column} />,
    },
    {
        accessorKey: "description",
        header: () => <DescriptionHeaderCell />,
        cell: ({ row }) => <DescriptionCell description={row.original.description} />,
    },
    {
        accessorKey: "duration",
        header: () => <DurationHeaderCell />,
        cell: ({ row }) => (
            <span className="flex items-center gap-1 text-blue-600 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {formatDuration(row.original.duration)}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: () => <StatusHeaderCell />,
        cell: ({ row }) => <StatusCell status={row.original.status} />,
    },
    {
        accessorKey: "canInterrupt",
        header: () => <CanInterruptHeaderCell />,
        cell: ({ row }) => <CanInterruptCell canInterrupt={row.original.canInterrupt} />,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <ActionCell 
                action={row.original}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
            />
        ),
    },
]