import { 
  TokenPricingConfig, 
  LicensePricingConfig, 
  UpdateTokenPricingRequest,
  UpdateLicensePricingRequest 
} from '@/types/pricing'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Token Pricing Config API
export const tokenPricingApi = {
  // Get token pricing config
  get: async (): Promise<TokenPricingConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/token-pricing`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch token pricing config')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching token pricing config:', error)
      throw error
    }
  },

  // Update token pricing config
  update: async (data: UpdateTokenPricingRequest): Promise<TokenPricingConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/token-pricing`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update token pricing config')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating token pricing config:', error)
      throw error
    }
  },
}

// License Pricing Config API
export const licensePricingApi = {
  // Get license pricing config
  get: async (): Promise<LicensePricingConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/license-pricing`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch license pricing config')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching license pricing config:', error)
      throw error
    }
  },

  // Update license pricing config
  update: async (data: UpdateLicensePricingRequest): Promise<LicensePricingConfig> => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/license-pricing`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update license pricing config')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating license pricing config:', error)
      throw error
    }
  },
}