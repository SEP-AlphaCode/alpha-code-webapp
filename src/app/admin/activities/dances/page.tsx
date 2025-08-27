"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedDances } from "@/api/dance-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateDanceModal } from "@/app/admin/activities/dances/dance-modal"
import { DeleteDanceModal } from "@/app/admin/activities/dances/delete-dance-modal"
import { ViewDanceModal } from "@/app/admin/activities/dances/view-dance-modal"
import { Dance } from "@/types/dance"
import { useDance } from "@/hooks/use-dance"
import { toast } from "react-toastify"

export default function DancesPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editDance, setEditDance] = useState<Dance | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteDance, setDeleteDance] = useState<Dance | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewDance, setViewDance] = useState<Dance | null>(null)

  const { useDeleteDance } = useDance()
  const deleteDanceMutation = useDeleteDance()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dances", page, size, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000) // 10 second timeout

      const [, currentPage, currentSize, search] = queryKey

      try {
        return await getPagedDances(
          currentPage as number,
          currentSize as number,
          search as string,
          controller.signal
        )
      } catch (error) {
        console.error("Failed to fetch dances:", error)
      }
    },
    retry: 2,
    retryDelay: 1000,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Dances Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading dances...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">Error loading dances</div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const dances = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1) // Reset to first page when changing size
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddDance = () => {
    setEditDance(null)
    setIsCreateModalOpen(true)
  }

  const handleEditDance = (dance: Dance) => {
    setEditDance(dance)
    setIsCreateModalOpen(true)
  }

  const handleViewDance = (dance: Dance) => {
    setViewDance(dance)
    setIsViewModalOpen(true)
  }

  const handleDeleteDance = (dance: Dance) => {
    setDeleteDance(dance)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteDance) return

    try {
      await deleteDanceMutation.mutateAsync(deleteDance.id)
      toast.success("Dance deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeleteDance(null)
    } catch (error) {
      console.error("Error deleting dance:", error)
      toast.error("Failed to delete dance. Please try again.")
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteDance(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewDance(null)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditDance(null)
  }

  const columns = createColumns(handleEditDance, handleDeleteDance, handleViewDance)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dances Management</h1>
          <Button
            onClick={handleAddDance}
            variant="outline"
          >
            Add Dance
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        size={size}
        data={dances}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search dances name or description..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />
      
      <CreateDanceModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editDance={editDance}
        mode={editDance ? 'edit' : 'create'}
      />
      
      <ViewDanceModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        dance={viewDance}
      />
      
      <DeleteDanceModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        dance={deleteDance}
        isDeleting={deleteDanceMutation.isPending}
      />
    </div>
  )
}
