// src/hooks/use-bundle.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBundle,
  deleteBundle,
  getBundleById,
  getPagedBundles,
  updateBundle,
} from "../api/bundle-api"
import { Bundle, BundleModal } from "@/types/bundle"

/* ---------------------------- Pagination Fetch ---------------------------- */
export const useBundles = (page: number, size: number, search?: string) => {
  return useQuery({
    queryKey: ["bundles", page, size, search],
    queryFn: ({ signal }) => getPagedBundles(page, size, search, signal),
  })
}

/* ------------------------------ Single Fetch ------------------------------ */
export const useBundle = (id: string) => {
  return useQuery({
    queryKey: ["bundle", id],
    queryFn: () => getBundleById(id),
    enabled: !!id,
  })
}

/* ----------------------------- Create Mutation ---------------------------- */
export const useCreateBundle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BundleModal) => {
      return await createBundle(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] })
    },
  })
}

/* ----------------------------- Update Mutation ---------------------------- */
export const useUpdateBundle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BundleModal }) => {
      return await updateBundle(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] })
    },
  })
}

/* ----------------------------- Delete Mutation ---------------------------- */
export const useDeleteBundle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteBundle(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] })
    },
  })
}
