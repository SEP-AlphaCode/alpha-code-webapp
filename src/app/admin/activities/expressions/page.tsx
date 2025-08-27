"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedExpressions } from "@/api/expression-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateExpressionModal } from "@/app/admin/activities/expressions/expression-modal"
import { DeleteExpressionModal } from "@/app/admin/activities/expressions/delete-expression-modal"
import { ViewExpressionModal } from "@/app/admin/activities/expressions/view-expression-modal"
import { Expression } from "@/types/expression"
import { useExpression } from "@/hooks/use-expression"
import { toast } from "react-toastify"

export default function ExpressionsPage() {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editExpression, setEditExpression] = useState<Expression | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteExpression, setDeleteExpression] = useState<Expression | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewExpression, setViewExpression] = useState<Expression | null>(null)

  const { useDeleteExpression } = useExpression()
  const deleteExpressionMutation = useDeleteExpression()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["expressions", page, size, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000) // 10 second timeout

      const [, currentPage, currentSize, search] = queryKey

      try {
        return await getPagedExpressions(
          currentPage as number,
          currentSize as number,
          search as string,
          controller.signal
        )
      } catch (error) {
        console.error("Failed to fetch expressions:", error)
      }
    },
    retry: 2,
    retryDelay: 1000,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Expressions Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading expressions...</div>
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
            <div className="text-lg text-red-600 mb-4">Error loading expressions</div>
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

  const expressions = data?.data || []

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1) // Reset to first page when changing size
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddExpression = () => {
    setEditExpression(null)
    setIsCreateModalOpen(true)
  }

  const handleEditExpression = (expression: Expression) => {
    setEditExpression(expression)
    setIsCreateModalOpen(true)
  }

  const handleViewExpression = (expression: Expression) => {
    setViewExpression(expression)
    setIsViewModalOpen(true)
  }

  const handleDeleteExpression = (expression: Expression) => {
    setDeleteExpression(expression)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteExpression) return

    try {
      await deleteExpressionMutation.mutateAsync(deleteExpression.id)
      toast.success("Expression deleted successfully!")
      setIsDeleteModalOpen(false)
      setDeleteExpression(null)
    } catch (error) {
      console.error("Error deleting expression:", error)
      toast.error("Failed to delete expression. Please try again.")
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteExpression(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewExpression(null)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditExpression(null)
  }

  const columns = createColumns(handleEditExpression, handleDeleteExpression, handleViewExpression)

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Expressions Management</h1>
          <Button
            onClick={handleAddExpression}
            variant="outline"
          >
            Add Expression
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        size={size}
        data={expressions}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search expressions name or description..."
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />
      
      <CreateExpressionModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editExpression={editExpression}
        mode={editExpression ? 'edit' : 'create'}
      />
      
      <ViewExpressionModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        expression={viewExpression}
      />
      
      <DeleteExpressionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        expression={deleteExpression}
        isDeleting={deleteExpressionMutation.isPending}
      />
    </div>
  )
}
