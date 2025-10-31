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
      mutationFn: createBundle,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
      },
    })

  // ✏️ Cập nhật bundle
  const useUpdateBundle = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: BundleModal }) => updateBundle(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bundles-paged"] })
        queryClient.invalidateQueries({ queryKey: ["bundle-none-deleted"] })
      },
    })

  // 🔧 Patch bundle
  const usePatchBundle = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<BundleModal> }) =>
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
