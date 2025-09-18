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
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const createColumns = (
  onEdit?: (expression: Expression) => void, 
  onDelete?: (expression: Expression) => void,
  onView?: (expression: Expression) => void
): ColumnDef<Expression>[] => {
  // Note: We can't use hooks directly in this function since it's not a component
  // Instead, we'll create a wrapper component for the action column
  
  const ActionCell = ({ row }: { row: { original: Expression } }) => {
    const { t } = useAdminTranslation()
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
          <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(expression.id)}
            className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            {t('common.copyId')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onView?.(expression)}
            className="hover:bg-green-50 hover:text-green-700 transition-all duration-200 cursor-pointer group"
          >
            <Eye className="mr-2 h-4 w-4 text-gray-600 group-hover:text-green-600 group-hover:scale-110 transition-all duration-200" />
            {t('common.viewDetails')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onEdit?.(expression)}
            className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer group"
          >
            <Edit className="mr-2 h-4 w-4 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-200" />
            {t('common.editItem')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete?.(expression)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer group"
          >
            <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-600 group-hover:scale-110 transition-all duration-200" />
            {t('common.deleteItem')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const HeaderCell = ({ text, translationKey }: { text: string, translationKey?: string }) => {
    const { t } = useAdminTranslation()
    return (
      <span className="flex items-center gap-1 text-gray-700 font-semibold">
        {translationKey ? t(translationKey) : text}
      </span>
    )
  }

  const CodeHeaderCell = () => {
    const { t } = useAdminTranslation()
    return (
      <span className="flex items-center gap-1 text-blue-700 font-semibold">
        {t('expressionManagement.fields.code')}
      </span>
    )
  }

  const NameHeaderCell = ({ column }: { column: { toggleSorting: (isAsc: boolean) => void, getIsSorted: () => string | false } }) => {
    const { t } = useAdminTranslation()
    return (
      <span className="flex items-center gap-1 text-purple-700 font-semibold">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto min-w-0 font-semibold"
        >
          {t('expressionManagement.fields.name')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </span>
    )
  }

  const ImageHeaderCell = () => {
    const { t } = useAdminTranslation()
    return (
      <span className="flex items-center gap-1 text-blue-600 font-semibold">
        {t('common.image')}
      </span>
    )
  }

  const StatusHeaderCell = () => {
    const { t } = useAdminTranslation()
    return (
      <span className="flex items-center gap-1 text-green-700 font-semibold">
        {t('expressionManagement.fields.status')}
      </span>
    )
  }

  const ImageCell = ({ row }: { row: { original: Expression } }) => {
    const { t } = useAdminTranslation()
    return (
      <div className="flex items-center gap-1 text-blue-600 font-medium">
        {row.original.imageUrl ? (
          <Image 
            src={row.original.imageUrl} 
            alt="Expression" 
            width={60}
            height={60}
            className="w-15 h-15 object-cover rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <span className="text-gray-400">{t('common.noImage')}</span>
        )}
      </div>
    )
  }

  const StatusCell = ({ row }: { row: { original: Expression } }) => {
    const { t } = useAdminTranslation()
    const status = row.original.status
    let color = "bg-gray-200 text-gray-700"
    let text = t('common.unknown')
    let icon = null
    
    if (status === 1) {
      color = "bg-green-100 text-green-700"
      text = t('common.active')
      icon = <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>
    } else if (status === 0) {
      color = "bg-red-100 text-red-700"
      text = t('common.inactive')
      icon = <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" /></svg>
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded ${color} font-semibold text-xs`}>
        {icon}
        {text}
      </span>
    )
  }

  return [
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
        header: () => <HeaderCell text="ID" translationKey="expressionManagement.fields.id" />,
        cell: ({ row }) => (
            <span className="text-gray-700 font-semibold">
                {row.original.id.substring(0, 8)}...
            </span>
        ),
    },
    {
        accessorKey: "code",
        header: CodeHeaderCell,
        cell: ({ row }) => (
            <span className="text-blue-700 font-mono bg-blue-50 px-2 py-1 rounded text-sm">
                {row.original.code}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: NameHeaderCell,
    },
    {
        accessorKey: "imageUrl",
        header: ImageHeaderCell,
        cell: ImageCell,
    },
    {
        accessorKey: "status",
        header: StatusHeaderCell,
        cell: StatusCell,
    },
    {
        id: "actions",
        cell: ActionCell,
    },
  ]
}
