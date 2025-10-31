import { DancePlanReposnse } from "@/types/music"
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface PreviewActivityData {
  dancePlan: DancePlanReposnse
  fileName?: string
  timeRange?: string
  sessionKey?: string
}

/**
 * Utility function để navigate tới PreviewActivitiesPage với data lớn
 * Sử dụng sessionStorage thay vì URL params để tránh giới hạn độ dài URL
 */
export function navigateToPreviewActivities(
  router: AppRouterInstance,
  data: PreviewActivityData,
  role: "parent" | "children" = "parent" // mặc định là parent
): void {
  try {
    // Generate unique session key or use provided one
    const sessionKey = data.sessionKey || `preview_activity_data_${Date.now()}`

    // Prepare data for sessionStorage
    const sessionData = {
      dancePlan: data.dancePlan,
      fileName: data.fileName || '',
      timeRange: data.timeRange || '',
      timestamp: new Date().toISOString()
    }

    // Store in sessionStorage
    sessionStorage.setItem(sessionKey, JSON.stringify(sessionData))

    // Create backup in localStorage (fallback)
    localStorage.setItem('preview_dance_plan_backup', JSON.stringify(data.dancePlan))

    // Navigate with only session key as param
    const searchParams = new URLSearchParams({
      sessionKey: sessionKey
    })

    router.push(`/${role}/music/previewactivities?${searchParams.toString()}`)

    console.log('✅ Navigated to preview with sessionStorage:', {
      sessionKey,
      dataSize: JSON.stringify(sessionData).length
    })

  } catch (error) {
    console.error('❌ Error navigating to preview activities:', error)

    // Fallback: Try with minimal URL params
    try {
      const searchParams = new URLSearchParams()
      if (data.fileName) {
        searchParams.set('file', encodeURIComponent(data.fileName))
      }
      if (data.timeRange) {
        searchParams.set('range', encodeURIComponent(data.timeRange))
      }

      // Store only dancePlan in sessionStorage for fallback
      sessionStorage.setItem('preview_activity_fallback', JSON.stringify(data.dancePlan))

      router.push(`/${role}/music/preview-activities?${searchParams.toString()}`)

    } catch (fallbackError) {
      console.error('❌ Fallback navigation also failed:', fallbackError)
      throw new Error('Unable to navigate to preview activities')
    }
  }
}

/**
 * Utility function để clean up sessionStorage data
 */
export function cleanupPreviewData(sessionKey?: string): void {
  try {
    if (sessionKey) {
      sessionStorage.removeItem(sessionKey)
    }

    // Clean up common keys
    sessionStorage.removeItem('preview_activity_data')
    sessionStorage.removeItem('preview_activity_fallback')
    localStorage.removeItem('preview_dance_plan_backup')

    console.log('✅ Cleaned up preview data')
  } catch (error) {
    console.error('❌ Error cleaning up preview data:', error)
  }
}

/**
 * Check if there's valid preview data in sessionStorage
 */
export function hasValidPreviewData(sessionKey?: string): boolean {
  try {
    const key = sessionKey || 'preview_activity_data'
    const data = sessionStorage.getItem(key)

    if (!data) return false

    const parsedData = JSON.parse(data)
    return !!(parsedData.dancePlan && parsedData.dancePlan.activity)
  } catch (error) {
    return false
  }
}