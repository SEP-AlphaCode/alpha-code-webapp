import React from 'react'
import Image from 'next/image'


interface ErrorStateProps {
  error?: Error | string | unknown
  onRetry?: () => void
  className?: string
}


export default function ErrorState({ error, onRetry, className = '' }: ErrorStateProps) {
  let rawMessage = 'Lỗi không xác định'

  if (typeof error === 'string') {
    rawMessage = error
  } else if (error instanceof Error) {
    rawMessage = error.message
  } else if (error && typeof error === 'object') {
    const maybeMessage = (error as { message?: unknown }).message
    if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) rawMessage = maybeMessage
  }

  // Basic mapping for known backend validation keys (could extend later)
  const normalized = rawMessage
    .replace(/^Validation Error:\s*/i, '')
    .replace(/^Error \d+:\s*/i, '')

  // Vietnamese only
  const title = 'Đã xảy ra lỗi'
  const suggestion = 'Vui lòng thử lại hoặc kiểm tra kết nối mạng của bạn.'
  const retryLabel = 'Thử lại'

  return (
    <div className={`w-full max-w-md mx-auto text-center flex flex-col items-center justify-center gap-6 ${className}`}>
      <div className="relative w-48 h-48">
        <Image
          src="/img_disconnect.png"
          alt="Disconnected / Error"
          fill
          className="object-contain drop-shadow-sm"
          priority
        />
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h2>
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2 break-words max-h-40 overflow-auto">
          {normalized}
        </div>
        <p className="text-sm text-gray-600 leading-snug">{suggestion}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}
