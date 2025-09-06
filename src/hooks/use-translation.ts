import { useI18n } from '@/lib/i18n/provider'

export function useTranslation() {
  const { dict, isLoading, locale } = useI18n()
  
  return {
    t: dict,
    isLoading,
    locale,
    isReady: !isLoading && !!dict
  }
}
