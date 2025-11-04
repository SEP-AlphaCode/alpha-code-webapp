"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BundleModal } from "./bundle-modal"
import { DeleteBundleModal } from "./delete-bundle-modal"
import { ViewBundleModal } from "./view-bundle-modal"
import { Bundle } from "@/types/bundle"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"
import { useBundle } from "@/features/bundle/hooks/use-bundle"

export default function BundlesPage() {
  // ⚙️ Pagination + Search
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // 🧩 Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editBundle, setEditBundle] = useState<Bundle | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteBundle, setDeleteBundle] = useState<Bundle | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewBundle, setViewBundle] = useState<Bundle | null>(null)

  // 🧠 Hooks
  const { useGetPagedBundles, useDeleteBundle } = useBundle()
  const deleteBundleMutation = useDeleteBundle()

  // 🕒 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 📦 Fetch Bundles
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetPagedBundles(page, size, debouncedSearchTerm)

  const bundles = data?.data || []

  // 🧩 Handlers
  const handleAddBundle = () => {
    setEditBundle(null)
    setIsCreateModalOpen(true)
  }

  const handleEditBundle = (bundle: Bundle) => {
    setEditBundle(bundle)
    setIsCreateModalOpen(true)
  }

  const handleViewBundle = (bundle: Bundle) => {
    setViewBundle(bundle)
    setIsViewModalOpen(true)
  }

  const handleDeleteBundle = (bundle: Bundle) => {
    setDeleteBundle(bundle)
    setIsDeleteModalOpen(true)
  }

  // 🗑️ Xác nhận xóa bundle
  const handleConfirmDelete = async () => {
    if (!deleteBundle) return
    try {
      await deleteBundleMutation.mutateAsync(deleteBundle.id)
      toast.success("Xóa bundle thành công!")
      setIsDeleteModalOpen(false)
      setDeleteBundle(null)
      refetch()
    } catch (err) {
      console.error("Error deleting bundle:", err)
      toast.error("Không thể xóa bundle. Vui lòng thử lại!")
    }
  }

  // 📋 Cột bảng
  const columns = createColumns(handleEditBundle, handleDeleteBundle, handleViewBundle)

  // 💡 Trạng thái tải dữ liệu
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
          <div className="text-lg text-red-600 mb-4">
            Lỗi khi tải danh sách Bundle
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )

  // 🖥️ Render chính
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý Bundle</h1>
        <Button onClick={handleAddBundle} variant="outline">
          + Thêm Bundle
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={bundles}
        size={size}
        onSizeChange={setSize}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm bundle..."
        page={page}
        onPageChange={setPage}
        pageCount={data?.total_pages || 0}
        total={data?.total_count || 0}
      />

      <BundleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        editBundle={editBundle}
        mode={editBundle ? "edit" : "create"}
        onSuccess={() => refetch()}
      />

      <ViewBundleModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bundle={viewBundle}
      />

      <DeleteBundleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        bundle={deleteBundle}
        isDeleting={deleteBundleMutation.isPending}
      />
    </div>
  )
}
