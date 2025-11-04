// File: use-bundle.ts

import {
  getPagedBundles,
  getNoneDeletedBundleById,
  getActiveBundleById,
  createBundle,
  updateBundle,
  patchBundle,
  deleteBundle,
} from "../api/bundle-api"
import { BundleModal } from "@/types/bundle"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

/* -------------------------------------------------------------------------- */
/* 🔧 Helper: convert sang FormData nếu có image                              */
/* -------------------------------------------------------------------------- */
const convertToFormData = (data: BundleModal): FormData | BundleModal => {
  if (data.coverImage instanceof File || data.coverImage instanceof FileList) { // <-- SỬA: Dùng coverImage
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description ?? "")
    formData.append("price", String(data.price))

    if (data.discountPrice !== undefined)
      formData.append("discountPrice", String(data.discountPrice))

    if (data.status !== undefined)
      formData.append("status", String(data.status))

    // 🖼️ hỗ trợ cả FileList
    if (data.coverImage instanceof FileList && data.coverImage.length > 0) // <-- SỬA: Dùng coverImage
      formData.append("coverImage", data.coverImage[0])
    else if (data.coverImage instanceof File) // <-- SỬA: Dùng coverImage
      formData.append("coverImage", data.coverImage)

    return formData
  }

  return data
}

/* -------------------------------------------------------------------------- */
/* 🧩 Hook quản lý bundle                                                     */
/* -------------------------------------------------------------------------- */
export const useBundle = () => {
  const queryClient = useQueryClient()

  // 📦 Lấy danh sách bundle có phân trang
  const useGetPagedBundles = (page: number, size: number, search?: string) =>
    useQuery({
      queryKey: ["bundles-paged", page, size, search],
      queryFn: async ({ queryKey }) => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 10000)
        const [, currentPage, currentSize, searchValue] = queryKey
        return await getPagedBundles(
          currentPage as number,
          currentSize as number,
          searchValue as string,
          controller.signal
        )
      },
      retry: 2,
      retryDelay: 1000,
    })

  // 🧩 Lấy bundle chưa bị xóa theo id
  const useGetNoneDeletedBundleById = (id: string) =>
    useQuery({
      queryKey: ["bundle-none-deleted", id],
      queryFn: () => getNoneDeletedBundleById(id),
      enabled: !!id,
    })

  // ⚡ Lấy bundle đang hoạt động theo id
  const useGetActiveBundleById = (id: string) =>
    useQuery({
      queryKey: ["bundle-active", id],
      queryFn: () => getActiveBundleById(id),
      enabled: !!id,
    })

  // ➕ Tạo bundle mới
  const useCreateBundle = () =>
    useMutation({
      mutationFn: async (data: BundleModal) => {
        const payload = convertToFormData(data)
        return await createBundle(payload)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
      },
    })

  // ✏️ Cập nhật bundle
  const useUpdateBundle = () =>
    useMutation({
      mutationFn: async ({ id, data }: { id: string; data: BundleModal }) => {
        const payload = convertToFormData(data)
        return await updateBundle(id, payload)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundle-none-deleted"] })
      },
    })

  // 🔧 Patch bundle (cập nhật 1 phần)
  const usePatchBundle = () =>
    useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<BundleModal> }) =>
        patchBundle(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
      },
    })

  // 🗑️ Xóa bundle
  const useDeleteBundle = () =>
    useMutation({
      mutationFn: deleteBundle,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundle-none-deleted"] })
      },
    })

  return {
    useGetPagedBundles,
    useGetNoneDeletedBundleById,
    useGetActiveBundleById,
    useCreateBundle,
    useUpdateBundle,
    usePatchBundle,
    useDeleteBundle,
  }
}