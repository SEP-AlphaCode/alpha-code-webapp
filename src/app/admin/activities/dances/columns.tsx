    "use client"

import { Dance } from "@/types/dance"
import { ColumnDef, Column } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"
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
const IdHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-gray-700 font-semibold">
            {t('danceManagement.fields.id')}
        </span>
    )
}

const CodeHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-blue-700 font-semibold">
            {t('danceManagement.fields.code')}
        </span>
    )
}

const NameHeaderCell = ({ column }: { column: Column<Dance, unknown> }) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-purple-700 font-semibold">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 h-auto min-w-0 font-semibold"
            >
                {t('danceManagement.fields.name')}
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
            {t('danceManagement.fields.description')}
        </span>
    )
}

const IconHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-red-700 font-semibold">
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {t('danceManagement.fields.icon')}
        </span>
    )
}

const DurationHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-blue-600 font-semibold">
            {t('danceManagement.fields.duration')}
        </span>
    )
}

const StatusHeaderCell = () => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    return (
        <span className="flex items-center gap-1 text-green-700 font-semibold">
            {t('danceManagement.fields.status')}
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

const IconCell = ({ icon }: { icon?: string }) => {
    const { t, isLoading } = useAdminTranslation()
    if (isLoading) return <span></span>
    
    return (
        <div className="max-w-xs">
            {icon ? (
                <Image 
                    src={icon} 
                    alt="Dance icon" 
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover rounded" 
                />
            ) : (
                <span className="text-sm text-gray-400">{t('common.noData')}</span>
            )}
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
    );
}

const ActionCell = ({ 
    dance, 
    onEdit, 
    onDelete, 
    onView 
}: { 
    dance: Dance
    onEdit?: (dance: Dance) => void
    onDelete?: (dance: Dance) => void
    onView?: (dance: Dance) => void
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
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(dance.id)}
                    className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                    {t('common.copyId')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => onView?.(dance)}
                    className="hover:bg-green-50 hover:text-green-700 transition-all duration-200 cursor-pointer group"
                >
                    <Eye className="mr-2 h-4 w-4 text-gray-600 group-hover:text-green-600 group-hover:scale-110 transition-all duration-200" />
                    {t('common.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => onEdit?.(dance)}
                    className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer group"
                >
                    <Edit className="mr-2 h-4 w-4 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200" />
                    {t('common.editItem')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => onDelete?.(dance)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer group"
                >
                    <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200" />
                    {t('common.deleteItem')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

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
        header: () => <IdHeaderCell />,
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
        accessorKey: "icon",
        header: () => <IconHeaderCell />,
        cell: ({ row }) => <IconCell icon={row.original.icon} />,
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
        id: "actions",
        cell: ({ row }) => (
            <ActionCell 
                dance={row.original}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
            />
        ),
    },
]
