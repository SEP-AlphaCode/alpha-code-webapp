import { useI18n } from '../provider'

// Type for translation objects
type TranslationObject = Record<string, unknown>

// Type-safe translation helper for homepage
export function useHomepageTranslation() {
  const { dict, commonDict, locale, isLoading } = useI18n()
  
  // Get homepage translations
  const homepage = dict?.homepage || {}
  const common = commonDict || dict?.common || {}
  
  // Helper function to get nested translation safely
  const t = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: unknown = homepage
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: unknown = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
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
    let value: unknown = pageDict
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: unknown = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
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
    let value: unknown = login
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: unknown = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
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
    let value: unknown = resetPassword
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: unknown = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
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

// Type-safe translation helper for admin
export function useAdminTranslation() {
  const { dict, commonDict, locale, isLoading } = useI18n()
  
  // Get admin translations
  const admin = dict?.admin || {}
  const common = commonDict || dict?.common || {}
  
  // Helper function to get nested translation safely
  const t = (key: string, defaultValue = '', params?: Record<string, string | number>) => {
    const keys = key.split('.')
    let value: unknown = admin
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
      } else {
        return defaultValue
      }
    }
    
    let result = typeof value === 'string' ? value : defaultValue
    
    // Replace parameters in the string
    if (params && result) {
      Object.entries(params).forEach(([key, val]) => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(val))
      })
    }
    
    return result
  }
  
  // Helper function to get common translations
  const tc = (key: string, defaultValue = '') => {
    const keys = key.split('.')
    let value: unknown = common
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && k in value) {
        value = (value as TranslationObject)[k]
      } else {
        return defaultValue
      }
    }
    
    return typeof value === 'string' ? value : defaultValue
  }
  
  return {
    t,       // Admin translations
    tc,      // Common translations  
    locale,
    isLoading,
    admin,
    common
  }
}
