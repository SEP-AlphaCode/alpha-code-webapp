export type SubscriptionPlan = {
  id: string
  name: string
  description: string
  price: number
  billingCycle: number   // 0 = unknown, 1 = monthly, 2 = yearly (tuỳ hệ thống quy ước)
  status: number
  statusText?: string
  createdDate: string
  lastUpdated: string
  isRecommended : boolean
}

export type SubscriptionPlanModal = {
  id: string
  name: string
  description: string
  price: number
  billingCycle: number
  // status?: number
  isRecommended : boolean
}

export type SubscriptionActivity = {
  planId: string
  startDate: string
  endDate?: string
  userId?: string
  status?: string
}