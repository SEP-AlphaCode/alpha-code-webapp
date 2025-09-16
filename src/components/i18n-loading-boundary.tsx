'use client'

import { useI18n } from '@/lib/i18n/provider'
import LoadingGif from './ui/loading-gif'

export function I18nLoadingBoundary({ children }: { children: React.ReactNode }) {
  const { isLoading } = useI18n()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingGif size="xl" />
      </div>
    )
  }

  return <>{children}</>
}
