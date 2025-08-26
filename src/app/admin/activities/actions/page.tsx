"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedActions } from "@/api/action-api"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateActionModal } from "@/app/admin/activities/actions/create-action-modal"

export default function ActionsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["actions", page, limit, debouncedSearchTerm],
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000) // 10 second timeout

      const [, currentPage, currentLimit, search] = queryKey

      try {
        return await getPagedActions(
          currentPage as number,
          currentLimit as number,
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
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Actions Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="text-lg text-gray-600">Loading actions...</div>
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
            <div className="text-lg text-red-600 mb-4">Error loading actions</div>
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

  const actions = data?.data || []

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }

  const handleAddAction = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Actions Management</h1>
          <Button
            onClick={handleAddAction}
            variant="outline"
          >
            Add Action
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={actions}
        limit={limit}
        onLimitChange={handleLimitChange}
      />
      
      <CreateActionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}