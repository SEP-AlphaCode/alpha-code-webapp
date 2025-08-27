"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedActions } from "@/api/action-api"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateActionModal } from "@/app/admin/activities/actions/action-modal"
import { DeleteActionModal } from "@/app/admin/activities/actions/delete-action-modal"
import { ViewActionModal } from "@/app/admin/activities/actions/view-action-modal"
import { Action } from "@/types/action"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  setSearchTerm,
  setPageSize,
  openCreateModal,
  openEditModal,
  openViewModal,
  openDeleteModal,
} from "@/store/slices/uiSlice"
import {
  setActions,
} from "@/store/slices/actionSlice"

export default function ActionsPage() {
  const dispatch = useAppDispatch()
  
  // Get state from Redux instead of local state
  const {
    searchTerm,
    currentPage,
    pageSize,
  } = useAppSelector((state) => state.ui)
  
  const {
    actions: actionsFromRedux,
  } = useAppSelector((state) => state.action)
  

  // Debounced search term (still need local state for debouncing)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["actions", currentPage, pageSize, debouncedSearchTerm],
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

  // Store data in Redux when API response changes
  useEffect(() => {
    if (data?.data) {
      dispatch(setActions({
        actions: data.data,
        totalCount: data.total || 0
      }))
    }
  }, [data, dispatch])

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

  const handleSizeChange = (newSize: number) => {
    dispatch(setPageSize(newSize))
  }

  const handleAddAction = () => {
    dispatch(openCreateModal('action'))
  }

  const handleEditAction = (action: Action) => {
    dispatch(openEditModal({ modalName: 'action', data: action }))
  }

  const handleViewAction = (action: Action) => {
    dispatch(openViewModal({ modalName: 'action', data: action }))
  }

  const handleDeleteAction = (action: Action) => {
    dispatch(openDeleteModal({ modalName: 'action', data: action }))
  }

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const columns = createColumns(handleEditAction, handleDeleteAction, handleViewAction)

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
        size={pageSize}
        data={actionsFromRedux}
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search actions name or description..."
      />
      
      <CreateActionModal />
      
      <ViewActionModal />
      
      <DeleteActionModal/>
    </div>
  )
}