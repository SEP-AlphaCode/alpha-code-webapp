"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedExtendedActions } from "@/features/activities/api/extended-action-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateExpressionModal } from "@/app/admin/activities/expressions/expression-modal"
import { DeleteExtendedActionModal } from "./delete-extended-action-modal"
import { ViewExpressionModal } from "@/app/admin/activities/expressions/view-expression-modal"
import { ExtendedAction } from "@/types/extended-action"
import { useExtendedActions } from "@/features/activities/hooks/use-extended-actions"
import { toast } from "sonner"

import LoadingGif from "@/components/ui/loading-gif"
import { CreateExtendedActionModal } from "./extended-action-modal"
import { ViewExtendedActionModal } from "./view-extended-action-modal"


function ExtendedActionPage() {
  // Đã loại bỏ i18n, chỉ dùng tiếng Việt
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editExtendedAction, setEditExtendedAction] = useState<ExtendedAction | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteExtendedAction, setDeleteExtendedAction] = useState<ExtendedAction | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewExtendedAction, setViewExtendedAction] = useState<ExtendedAction | null>(null)

  const { useDeleteExtendedAction } = useExtendedActions()
  const deleteExtendedActionMutation = useDeleteExtendedAction()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["extended_actions", page, size, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000) // 10 second timeout

      const [, currentPage, currentSize, search] = queryKey

      try {
        return await getPagedExtendedActions(
          currentPage as number,
          currentSize as number,
          search as string,
          controller.signal
        )
      } catch (error) {
        console.error("Failed to fetch extended actions:", error)
      }
    },
    retry: 2,
    retryDelay: 1000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="lg" message="Loading extended actions..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading extended actions</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const extended_actions = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1) // Reset to first page when changing size
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddExtendedAction = () => {
    setEditExtendedAction(null)
    setIsCreateModalOpen(true)
  }

  const handleEditExtendedAction = (extended_actions: ExtendedAction) => {
    setEditExtendedAction(extended_actions)
    setIsCreateModalOpen(true)
  }

  const handleViewExtendedAction = (extended_actions: ExtendedAction) => {
    setViewExtendedAction(extended_actions)
    setIsViewModalOpen(true)
  }

  const handleDeleteExtendedAction = (extended_actions: ExtendedAction) => {
    setDeleteExtendedAction(extended_actions)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteExtendedAction) return

    try {
      await deleteExtendedActionMutation.mutateAsync(deleteExtendedAction.id)
      toast.success("Extended action deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeleteExtendedAction(null)
    } catch (error) {
      console.error("Error deleting extended action:", error)
      toast.error("Failed to delete extended action. Please try again.")
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteExtendedAction(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewExtendedAction(null)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditExtendedAction(null)
  }

  const columns = createColumns(handleEditExtendedAction, handleDeleteExtendedAction, handleViewExtendedAction)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý biểu cảm</h1>
          <Button
            onClick={handleAddExtendedAction}
            variant="outline"
          >
            Thêm biểu cảm
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        size={size}
        data={extended_actions}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm biểu cảm..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />
      
      <CreateExtendedActionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editExtendedAction={editExtendedAction}
        mode={editExtendedAction ? 'edit' : 'create'}
      />
      
      <ViewExtendedActionModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        extended_actions={viewExtendedAction}
      />
      
      <DeleteExtendedActionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        extended_action={deleteExtendedAction}
        isDeleting={deleteExtendedActionMutation.isPending}
      />
    </div>
  )
}

export default ExtendedActionPage
