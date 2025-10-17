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

// Token Rule for various services (NLP, AI, API calls, etc.)
export interface TokenRule {
  id: string
  code: string          // Service identifier (e.g., "NLP_TOKEN", "AI_SERVICE", "API_CALL")
  cost: number          // Cost per token usage in VND
  note?: string         // Optional description/notes
  createdDate: string
  lastUpdated: string
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