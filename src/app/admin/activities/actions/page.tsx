"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedActions } from "@/api/action-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateActionModal } from "@/app/admin/activities/actions/action-modal"
import { DeleteActionModal } from "@/app/admin/activities/actions/delete-action-modal"
import { ViewActionModal } from "@/app/admin/activities/actions/view-action-modal"
import { Action } from "@/types/action"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"

export default function ActionsPage() {
  // Removed i18n translation logic
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editAction, setEditAction] = useState<Action | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteAction, setDeleteAction] = useState<Action | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewAction, setViewAction] = useState<Action | null>(null)

  const { useDeleteAction } = useAction()
  const deleteActionMutation = useDeleteAction()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["actions", page, size, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000) // 10 second timeout

      const [, currentPage, currentSize, search] = queryKey

      try {
        return await getPagedActions(
          currentPage as number,
          currentSize as number,
          search as string,
          controller.signal
        )
      } catch (error) {
        console.error("Failed to fetch actions:", error)
      }
    },
    retry: 2,
    retryDelay: 1000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading actions</div>
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

  const actions = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1) // Reset to first page when changing size
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddAction = () => {
    setEditAction(null)
    setIsCreateModalOpen(true)
  }

  const handleEditAction = (action: Action) => {
    setEditAction(action)
    setIsCreateModalOpen(true)
  }

  const handleViewAction = (action: Action) => {
    setViewAction(action)
    setIsViewModalOpen(true)
  }

  const handleDeleteAction = (action: Action) => {
    setDeleteAction(action)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteAction) return

    try {
      await deleteActionMutation.mutateAsync(deleteAction.id)
      toast.success("Action deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeleteAction(null)
    } catch (error) {
      console.error("Error deleting action:", error)
      toast.error("Failed to delete action. Please try again.")
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteAction(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewAction(null)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditAction(null)
  }

  const columns = createColumns(handleEditAction, handleDeleteAction, handleViewAction)

  // Removed loading state for translations

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý hành động</h1>
          <Button
            onClick={handleAddAction}
            variant="outline"
          >
            Thêm hành động
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        size={size}
        data={actions}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
  searchPlaceholder="Tìm kiếm hành động..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />
      
      <CreateActionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editAction={editAction}
        mode={editAction ? 'edit' : 'create'}
      />
      
      <ViewActionModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        action={viewAction}
      />
      
      <DeleteActionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        action={deleteAction}
        isDeleting={deleteActionMutation.isPending}
      />
    </div>
  )
}