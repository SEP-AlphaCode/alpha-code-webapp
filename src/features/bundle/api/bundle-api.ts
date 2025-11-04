// File: bundle-api.ts

import { Bundle, BundleModal } from "@/types/bundle"
import { PagedResult } from "@/types/page-result"
import { coursesHttp } from "@/utils/http"

/** 🧭 Lấy danh sách bundle có phân trang */
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

/** 🧩 Lấy bundle chưa bị xóa theo id */
export const getNoneDeletedBundleById = async (id: string): Promise<Bundle> => {
  const response = await coursesHttp.get<Bundle>(`/bundles/none-deleted/${id}`)
  return response.data
}

/** ⚡ Lấy bundle đang hoạt động theo id */
export const getActiveBundleById = async (id: string): Promise<Bundle> => {
  const response = await coursesHttp.get<Bundle>(`/bundles/active/${id}`)
  return response.data
}

/* -------------------------------------------------------------------------- */
/* 🧰 Helper: auto convert BundleModal -> FormData nếu có file upload          */
/* -------------------------------------------------------------------------- */
const convertToFormData = (data: BundleModal): FormData => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("description", data.description ?? "")
  formData.append("price", data.price.toString())

  if (data.discountPrice !== undefined && data.discountPrice !== null)
    formData.append("discountPrice", data.discountPrice.toString())

  if (data.status !== undefined)
    formData.append("status", data.status.toString())

  // ✅ Sử dụng coverImage làm tên trường và key trong FormData
  if (data.coverImage instanceof File) { // <-- SỬA: Dùng coverImage
    formData.append("coverImage", data.coverImage) // <-- SỬA: Dùng coverImage
  }

  return formData
}

/* -------------------------------------------------------------------------- */
/* ✨ Tạo bundle mới (tự nhận BundleModal hoặc FormData đều được)              */
/* -------------------------------------------------------------------------- */
export const createBundle = async (bundleData: BundleModal | FormData): Promise<Bundle> => {
  const payload = bundleData instanceof FormData ? bundleData : convertToFormData(bundleData)

  const response = await coursesHttp.post<Bundle>("/bundles", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

/* -------------------------------------------------------------------------- */
/* 🛠️ Cập nhật bundle (PUT multipart/form-data)                               */
/* -------------------------------------------------------------------------- */
export const updateBundle = async (
  id: string,
  bundleData: BundleModal | FormData
): Promise<Bundle> => {
  const payload = bundleData instanceof FormData ? bundleData : convertToFormData(bundleData)

  const response = await coursesHttp.put<Bundle>(`/bundles/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

/* -------------------------------------------------------------------------- */
/* 🔧 Cập nhật một phần bundle (PATCH JSON)                                   */
/* -------------------------------------------------------------------------- */
export const patchBundle = async (
  id: string,
  partialData: Partial<BundleModal>
): Promise<Bundle> => {
  const response = await coursesHttp.patch<Bundle>(`/bundles/${id}`, partialData)
  return response.data
}

/* -------------------------------------------------------------------------- */
/* 🗑️ Xóa bundle                                                              */
/* -------------------------------------------------------------------------- */
export const deleteBundle = async (id: string): Promise<void> => {
  await coursesHttp.delete(`/bundles/${id}`)
}