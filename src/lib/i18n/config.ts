import { VN } from 'country-flag-icons/react/3x2'
import { US } from 'country-flag-icons/react/3x2'

export const i18n = {
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
}

export const LocaleFlagComponents: Record<Locale, React.ComponentType<{ className?: string }>> = {
  vi: VN,
  en: US,
}

export const localeInfo: Record<Locale, {
  name: string
  nativeName: string
  flag: string
  FlagComponent: React.ComponentType<{ className?: string }>
}> = {
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    FlagComponent: VN,
  },
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    FlagComponent: US,
  },
}
