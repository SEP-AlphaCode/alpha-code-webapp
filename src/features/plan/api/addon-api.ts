import { Addon, AddonModal } from "@/types/addon"
import { PagedResult } from "@/types/page-result"
import { paymentsHttp } from "@/utils/http"

// ✅ Lấy danh sách addon có phân trang
export const getPagedAddons = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal,
) => {
  const response = await paymentsHttp.get<PagedResult<Addon>>("/addons", {
    params: { page, size, search },
    signal,
  })
  return response.data
}

// ✅ Lấy danh sách addon chưa bị xóa
export const getNoneDeletedAddons = async () => {
  const response = await paymentsHttp.get<Addon[]>("/addons/none-deleted")
  return response.data
}

// ✅ Lấy 1 addon chưa bị xóa theo id
export const getNoneDeletedAddonById = async (id: string) => {
  const response = await paymentsHttp.get<Addon>(`/addons/none-deleted/${id}`)
  return response.data
}

// ✅ Lấy addon active theo id
export const getActiveAddonById = async (id: string) => {
  const response = await paymentsHttp.get<Addon>(`/addons/active/${id}`)
  return response.data
}

// ✅ Tạo addon mới
export const createAddon = async (addonData: AddonModal) => {
  const response = await paymentsHttp.post("/addons", addonData)
  return response.data
}

// ✅ Cập nhật toàn bộ addon
export const updateAddon = async (id: string, addonData: AddonModal) => {
  const response = await paymentsHttp.put(`/addons/${id}`, addonData)
  return response.data
}

// ✅ Cập nhật một phần (patch)
export const patchAddon = async (id: string, partialData: Partial<AddonModal>) => {
  const response = await paymentsHttp.patch(`/addons/${id}`, partialData)
  return response.data
}

// ✅ Xóa addon theo id
export const deleteAddon = async (id: string) => {
  const response = await paymentsHttp.delete(`/addons/${id}`)
  return response.data
}
