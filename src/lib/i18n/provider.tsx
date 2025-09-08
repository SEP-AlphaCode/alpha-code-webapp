'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Locale } from './config'
import { i18n } from './config'
import { getCommonDictionary, getPageDictionary, getLegacyDictionary } from './get-dictionary'

// More flexible type for dictionaries - using index signature for dynamic access
type Dictionary = { [key: string]: string | number | boolean | Dictionary | Dictionary[] }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dict: Dictionary | null
  commonDict: Dictionary | null
  isLoading: boolean
  // New methods for page-specific dictionaries
  getPageDict: (page: string) => Promise<Dictionary>
  getLegacyDict: () => Promise<Dictionary>
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ 
  children, 
  page 
}: { 
  children: ReactNode
  page?: string // Page identifier for loading page-specific translations
}) {
  const [locale, setLocaleState] = useState<Locale>(i18n.defaultLocale)
  const [dict, setDict] = useState<Dictionary | null>(null)
  const [commonDict, setCommonDict] = useState<Dictionary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('preferred-locale', newLocale)
  }

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('preferred-locale') as Locale
    if (savedLocale && i18n.locales.includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  // Helper methods for dynamic dictionary loading
  const getPageDict = async (pageName: string): Promise<Dictionary> => {
    try {
      return await getPageDictionary(pageName, locale)
    } catch (error) {
      console.error(`Failed to load dictionary for page "${pageName}":`, error)
      return {}
    }
  }

  const getLegacyDict = async (): Promise<Dictionary> => {
    try {
      return await getLegacyDictionary(locale)
    } catch (error) {
      console.error('Failed to load legacy dictionary:', error)
      return {}
    }
  }

  useEffect(() => {
    const loadDictionaries = async () => {
      setIsLoading(true)
      try {
        // Always load common dictionary
        const common = await getCommonDictionary(locale)
        setCommonDict(common)

        // Load page-specific dictionary if page is specified
        if (page) {
          const pageDict = await getPageDictionary(page, locale)
          setDict({ common, [page]: pageDict })
        } else {
          // For backward compatibility, just use common dictionary
          setDict({ common })
        }
      } catch (error) {
        console.error('Failed to load dictionaries:', error)
        // Fallback to default locale
        if (locale !== i18n.defaultLocale) {
          try {
            const fallbackCommon = await getCommonDictionary(i18n.defaultLocale)
            setCommonDict(fallbackCommon)
            
            if (page) {
              const fallbackPageDict = await getPageDictionary(page, i18n.defaultLocale)
              setDict({ common: fallbackCommon, [page]: fallbackPageDict })
            } else {
              // For backward compatibility, just use common dictionary
              setDict({ common: fallbackCommon })
            }
          } catch (fallbackError) {
            console.error('Failed to load fallback dictionaries:', fallbackError)
            setCommonDict({})
            setDict({})
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDictionaries()
  }, [locale, page])

  return (
    <I18nContext.Provider value={{ 
      locale, 
      setLocale, 
      dict, 
      commonDict, 
      isLoading, 
      getPageDict, 
      getLegacyDict 
    }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
