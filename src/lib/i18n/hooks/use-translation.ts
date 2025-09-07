import { useI18n } from '../provider'

// Type-safe translation helper for homepage
export function useHomepageTranslation() {
  const { dict, commonDict, locale, isLoading } = useI18n()
  
  // Get homepage translations
  const homepage = dict?.homepage || {}
  const common = commonDict || dict?.common || {}
  
  // Helper function to get nested translation safely
  const t = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = homepage
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  return {
    t,       // Homepage translations
    tc,      // Common translations  
    locale,
    isLoading,
    homepage,
    common
  }
}

// Generic translation helper for any page
export function useTranslation(page?: string) {
  const { dict, commonDict, locale, isLoading, getPageDict } = useI18n()
  
  const common = commonDict || dict?.common || {}
  const pageDict = page ? dict?.[page] || {} : dict || {}
  
  // Helper function to get nested translation safely
  const t = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = pageDict
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Function to load additional page dictionary
  const loadPageDict = async (pageName: string) => {
    try {
      return await getPageDict(pageName)
    } catch (error) {
      console.error(`Failed to load dictionary for page "${pageName}":`, error)
      return {}
    }
  }
  
  return {
    t,              // Page translations
    tc,             // Common translations
    locale,
    isLoading,
    pageDict,
    common,
    loadPageDict
  }
}

// Type-safe translation helper for login page
export function useLoginTranslation() {
  const { dict, commonDict, locale, isLoading } = useI18n()
  
  // Get login translations
  const login = dict?.login || {}
  const common = commonDict || dict?.common || {}
  
  // Helper function to get nested translation safely
  const t = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = login
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  return {
    t,              // Login page translations
    tc,             // Common translations
    locale,
    isLoading,
    login,
    common
  }
}

// Type-safe translation helper for reset-password pages
export function useResetPasswordTranslation() {
  const { dict, commonDict, locale, isLoading } = useI18n()
  
  // Get reset-password translations
  const resetPassword = dict?.['reset-password'] || {}
  const common = commonDict || dict?.common || {}
  
  // Helper function to get nested translation safely
  const t = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = resetPassword
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: any = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  return {
    t,              // Reset password page translations
    tc,             // Common translations
    locale,
    isLoading,
    resetPassword,
    common
  }
}
