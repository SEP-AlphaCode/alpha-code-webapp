export type Addon = {
  id: string
  name: string
  description: string
  price: number
  category: number         // 0 = unknown (tuỳ hệ thống quy ước)
  categoryText?: string
  status: number           // 0 = inactive, 1 = active
  statusText?: string
  createdDate: string
  lastUpdated: string
}

export type AddonModal = {
  name: string
  description: string
  price: number
  category: number
}
