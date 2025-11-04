// src/app/api/bundle-api.ts
import { Bundle, BundleModal } from "@/types/bundle"
import { PagedResult } from "@/types/page-result"
import { coursesHttp } from "@/utils/http"

/* ---------------------------- Helper: FormData ---------------------------- */
const convertToFormData = (data: BundleModal): FormData => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("description", data.description ?? "")
  formData.append("price", data.price.toString())

  if (data.discountPrice !== undefined && data.discountPrice !== null)
    formData.append("discountPrice", data.discountPrice.toString())

  if (data.status !== undefined)
    formData.append("status", data.status.toString())

  // ✅ chỉ append nếu là File, không phải URL string
  if (data.coverImage instanceof File) {
    formData.append("coverImage", data.coverImage)
  }

  return formData
}

/* ------------------------------ API FUNCTIONS ----------------------------- */

export const getPagedBundles = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal
): Promise<PagedResult<Bundle>> => {
  const response = await coursesHttp.get<PagedResult<Bundle>>("/bundles", {
    params: { page, size, search },
    signal,
  })
  return response.data
}

export const getBundleById = async (id: string): Promise<Bundle> => {
  const response = await coursesHttp.get<Bundle>(`/bundles/${id}`)
  return response.data
}

export const createBundle = async (
  data: BundleModal | FormData
): Promise<Bundle> => {
  const payload = data instanceof FormData ? data : convertToFormData(data)
  const response = await coursesHttp.post<Bundle>("/bundles", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const updateBundle = async (
  id: string,
  data: BundleModal | FormData
): Promise<Bundle> => {
  const payload = data instanceof FormData ? data : convertToFormData(data)
  const response = await coursesHttp.put<Bundle>(`/bundles/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const deleteBundle = async (id: string): Promise<void> => {
  await coursesHttp.delete(`/bundles/${id}`)
}
