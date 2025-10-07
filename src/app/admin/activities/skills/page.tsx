"use client"

import { createColumns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { getPagedSkills } from "@/features/activities/api/skill-api" // Đổi API function
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateSkillModal } from "@/app/admin/activities/skills/skill-modal" // Đổi component modal
import { DeleteSkillModal } from "@/app/admin/activities/skills/delete-skill-modal" // Đổi component modal
import { ViewSkillModal } from "@/app/admin/activities/skills/view-skill-modal" // Đổi component modal
import { Skill } from "@/types/skills"
import { useSkill } from "@/features/activities/hooks/use-skills"
import { toast } from "sonner"
import LoadingGif from "@/components/ui/loading-gif"

export default function SkillsPage() { // Đổi tên component export
  // Removed i18n translation logic
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editSkill, setEditSkill] = useState<Skill | null>(null) // Đổi biến
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null) // Đổi biến
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewSkill, setViewSkill] = useState<Skill | null>(null) // Đổi biến

  const { useDeleteSkill } = useSkill() // Đổi hook
  const deleteSkillMutation = useDeleteSkill()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["skills", page, size, debouncedSearchTerm], // Đổi query key
    queryFn: async ({ queryKey }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000) // 10 second timeout

      const [, currentPage, currentSize, search] = queryKey

      try {
        return await getPagedSkills( // Đổi API call
          currentPage as number,
          currentSize as number,
          search as string,
          controller.signal
        )
      } catch (error) {
        console.error("Failed to fetch skills:", error) // Đổi log
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
          <div className="text-lg text-red-600 mb-4">Error loading skills</div> {/* Đổi text */}
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

  const skills = data?.data || [] // Đổi tên biến

  const handleSizeChange = (newSize: number) => {
    setSize(newSize)
    setPage(1) // Reset to first page when changing size
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddSkill = () => { // Đổi tên hàm
    setEditSkill(null)
    setIsCreateModalOpen(true)
  }

  const handleEditSkill = (skill: Skill) => { // Đổi tên hàm và param
    setEditSkill(skill)
    setIsCreateModalOpen(true)
  }

  const handleViewSkill = (skill: Skill) => { // Đổi tên hàm và param
    setViewSkill(skill)
    setIsViewModalOpen(true)
  }

  const handleDeleteSkill = (skill: Skill) => { // Đổi tên hàm và param
    setDeleteSkill(skill)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteSkill) return // Đổi biến

    try {
      await deleteSkillMutation.mutateAsync(deleteSkill.id)
      toast.success("Skill deleted successfully!") // Đổi toast
      setIsDeleteModalOpen(false)
      setDeleteSkill(null) // Đổi biến
    } catch (error) {
      console.error("Error deleting skill:", error) // Đổi log
      toast.error("Failed to delete skill. Please try again.") // Đổi toast
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteSkill(null) // Đổi biến
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewSkill(null) // Đổi biến
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditSkill(null) // Đổi biến
  }

  const columns = createColumns(handleEditSkill, handleDeleteSkill, handleViewSkill) // Đổi tên hàm truyền vào

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Quản lý kĩ năng</h1> {/* Đổi text */}
          <Button
            onClick={handleAddSkill} // Đổi tên hàm
            variant="outline"
          >
            Thêm kĩ năng {/* Đổi text */}
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        size={size}
        data={skills} // Đổi data
        onSizeChange={handleSizeChange}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm kĩ năng..." // Đổi text
        pageCount={data?.total_pages || 0}
        page={page}
        onPageChange={handlePageChange}
        total={data?.total_count || 0}
      />
      
      <CreateSkillModal // Đổi component
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editSkill={editSkill} // Đổi prop
        mode={editSkill ? 'edit' : 'create'}
      />
      
      <ViewSkillModal // Đổi component
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        skill={viewSkill} // Đổi prop
      />
      
      <DeleteSkillModal // Đổi component
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        skill={deleteSkill} // Đổi prop
        isDeleting={deleteSkillMutation.isPending}
      />
    </div>
  )
}
