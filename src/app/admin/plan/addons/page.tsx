"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateAddonModal } from "./addon-modal"
import { DeleteAddonModal } from "./delete-subscription-modal"
import { ViewAddonModal } from "./view-addon-modal"
import { Addon } from "@/types/addon"
import { getPagedAddons } from "@/features/plan/api/addon-api"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"

export default function AddonsPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editAddon, setEditAddon] = useState<Addon | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteAddon, setDeleteAddon] = useState<Addon | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewAddon, setViewAddon] = useState<Addon | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["addons", page, size, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 10000)
      const [, currentPage, currentSize, search] = queryKey
      return await getPagedAddons(
        currentPage as number,
        currentSize as number,
        search as string,
        controller.signal
      )
    },
    retry: 2,
    retryDelay: 1000,
  })

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingGif size="xl" />
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading addons</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )

  const addons = data?.data || []

  const handleAddAddon = () => {
    setEditAddon(null)
    setIsCreateModalOpen(true)
  }

  const handleEditAddon = (addon: Addon) => {
    setEditAddon(addon)
    setIsCreateModalOpen(true)
  }

  const handleViewAddon = (addon: Addon) => {
    setViewAddon(addon)
    setIsViewModalOpen(true)
  }

  const handleDeleteAddon = (addon: Addon) => {
    setDeleteAddon(addon)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteAddon) return
    try {
      toast.success("Addon deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeleteAddon(null)
    } catch (error) {
      console.error("Error deleting addon:", error)
      toast.error("Failed to delete addon. Please try again.")
    }
  }

  const columns = createColumns(handleEditAddon, handleDeleteAddon, handleViewAddon)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">Quản lý Addon</h1>
          <Button onClick={handleAddAddon} variant="outline">
            Thêm Addon
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        size={size}
        data={addons}
        onSizeChange={setSize}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm addon..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={setPage}
        total={data?.total_count || 0}
      />

      <CreateAddonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editAddon={editAddon}
        mode={editAddon ? "edit" : "create"}
      />
      <ViewAddonModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        addon={viewAddon}
      />
      <DeleteAddonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        addon={deleteAddon}
      />
    </div>
  )
}
