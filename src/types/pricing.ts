export interface TokenPricingConfig {
  id: string
  value: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateTokenPricingRequest {
  value: number
  note?: string
}

export interface LicensePricingConfig {
  id: string
  value: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateLicensePricingRequest {
  value: number
  note?: string
}