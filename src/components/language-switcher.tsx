'use client'

import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n/provider'
import { i18n, localeNames, type Locale } from '@/lib/i18n/config'
import { VN } from 'country-flag-icons/react/3x2'
import { US } from 'country-flag-icons/react/3x2'

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const { locale, setLocale, dict, commonDict } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  // Get language text from common dictionary or fallback
  const getLanguageText = () => {
    // Type guard function to check if value is an object with language property
    const getNestedLanguage = (obj: unknown): string | undefined => {
      if (obj && typeof obj === 'object' && 'language' in obj) {
        const lang = (obj as { language: unknown }).language
        return typeof lang === 'string' ? lang : undefined
      }
      return undefined
    }

    const getNavigationLanguage = (dict: unknown): string | undefined => {
      if (dict && typeof dict === 'object' && 'navigation' in dict) {
        return getNestedLanguage((dict as { navigation: unknown }).navigation)
      }
      return undefined
    }

    return getNavigationLanguage(commonDict) ||
           getNavigationLanguage((dict as { common?: unknown })?.common) ||
           getNavigationLanguage(dict) ||
           'Language'
  }

  // Render flag component based on locale
  const renderFlag = (locale: Locale) => {
    const flagProps = { className: "w-5 h-3 object-cover rounded-sm" }
    switch (locale) {
      case 'vi':
        return <VN {...flagProps} />
      case 'en':
        return <US {...flagProps} />
      default:
        return <US {...flagProps} />
    }
  }

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-gray-600  ${className}`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">
              {getLanguageText()}
            </span>
            {renderFlag(locale)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {i18n.locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {renderFlag(loc)}
                <span>{localeNames[loc]}</span>
              </div>
              {locale === loc && <Check className="w-4 h-4 text-blue-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
        >
          <Globe className="w-4 h-4" />
          <span>{localeNames[locale]}</span>
          {renderFlag(locale)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {i18n.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {renderFlag(loc)}
              <span>{localeNames[loc]}</span>
            </div>
            {locale === loc && <Check className="w-4 h-4 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
