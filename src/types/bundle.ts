// Kiểu dữ liệu trả về từ API
export type Bundle = {
  id: string
  name: string
  description: string
  price: number
  discountPrice: number
  coverImage: string
  statusText: string
  status: number
  lastUpdated: string
  createdDate: string
}

// Kiểu dữ liệu gửi đi (form)
export type BundleModal = {
  id?: string
  name: string
  description: string
  price: number
  discountPrice?: number
  status?: number
  coverImage?: File | FileList | null 
}
