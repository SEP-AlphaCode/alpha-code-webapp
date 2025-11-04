"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  assignCourseToBundle,
  deleteCourseBundle,
  getCoursesByBundle,
} from "../api/course-bundle-api"
import {
  CourseBundleAssignRequest,
  CourseInBundle,
} from "@/types/course-bundle"
import { toast } from "sonner"

// 🧠 QUERY KEY helper (giúp cache theo bundleId)
const courseBundleKeys = {
  all: ["course-bundles"] as const,
  list: (bundleId: string) => [...courseBundleKeys.all, bundleId] as const,
}

// 🧾 Lấy danh sách khóa học trong 1 bundle
export function useCoursesByBundle(bundleId?: string, enabled = true) {
  return useQuery<CourseInBundle[]>({
    queryKey: courseBundleKeys.list(bundleId || ""),
    queryFn: () => getCoursesByBundle(bundleId!),
    enabled: !!bundleId && enabled,
  })
}

// 🔗 Gắn khóa học vào bundle
export function useAssignCoursesToBundle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CourseBundleAssignRequest) =>
      assignCourseToBundle(payload),
    onSuccess: (_, variables) => {
      toast.success("Đã gắn khóa học vào bundle thành công 🎉")
      // Làm mới danh sách khóa học trong bundle
      queryClient.invalidateQueries({
        queryKey: courseBundleKeys.list(variables.bundleIds),
      })
    },
    onError: (err: any) => {
      console.error("Attach course error:", err)
      toast.error("Không thể gắn khóa học vào bundle ❌")
    },
  })
}

// 🗑️ Xóa khóa học khỏi bundle
export function useDeleteCourseBundle(bundleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCourseBundle(id),
    onSuccess: () => {
      toast.success("Đã xóa khóa học khỏi bundle ✅")
      queryClient.invalidateQueries({
        queryKey: courseBundleKeys.list(bundleId),
      })
    },
    onError: (err: any) => {
      console.error("Delete course-bundle error:", err)
      toast.error("Không thể xóa khóa học khỏi bundle ❌")
    },
  })
}
