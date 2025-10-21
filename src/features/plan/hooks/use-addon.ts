import {
  getPagedAddons,
  createAddon,
  updateAddon,
  deleteAddon,
  getNoneDeletedAddons,
  getActiveAddonById,
  patchAddon,
} from "../api/addon-api"
import { AddonModal } from "@/types/addon"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddon = () => {
  const queryClient = useQueryClient()

  const useGetPagedAddons = (page: number, limit: number, search?: string) =>
    useQuery({
      queryKey: ["addons", page, limit, search],
      queryFn: () => getPagedAddons(page, limit, search),
    })

  const useGetNoneDeletedAddons = () =>
    useQuery({
      queryKey: ["addons-none-deleted"],
      queryFn: getNoneDeletedAddons,
    })

  const useGetActiveAddonById = (id: string) =>
    useQuery({
      queryKey: ["addon-active", id],
      queryFn: () => getActiveAddonById(id),
      enabled: !!id,
    })

  const useCreateAddon = () =>
    useMutation({
      mutationFn: createAddon,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addons"] }),
    })

  const useUpdateAddon = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: AddonModal }) => updateAddon(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addons"] }),
    })

  const usePatchAddon = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<AddonModal> }) => patchAddon(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addons"] }),
    })

  const useDeleteAddon = () =>
    useMutation({
      mutationFn: deleteAddon,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addons"] }),
    })

  return {
    useGetPagedAddons,
    useGetNoneDeletedAddons,
    useGetActiveAddonById,
    useCreateAddon,
    useUpdateAddon,
    usePatchAddon,
    useDeleteAddon,
  }
}
