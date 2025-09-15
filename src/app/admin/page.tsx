"use client"

import { useDashboard } from "@/hooks/use-dashboard"
// import { UserStatsChart } from "@/components/ui/user-stats-chart"
import { UserStatsOverview } from "@/components/ui/user-stats-overview"
import { GrowthTrendChart } from "@/components/ui/growth-trend-chart"
import { UserDistributionChart } from "@/components/ui/user-distribution-chart"
import { RateLimitWarning } from "@/components/ui/rate-limit-warning"
import { Users, TrendingUp, PieChart, Activity } from "lucide-react"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"
import { ApiResponse } from "@/types/api-error"

export default function AdminDashboard() {
  const { useGetDashboardStats, useGetOnlineUsersCount, useGetUserStats } = useDashboard("admin")
  const { t } = useAdminTranslation()
  
  const { 
    data: dashboardStats, 
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
    isRefetching: isRefetchingStats
  } = useGetDashboardStats()
  
  const { 
    data: onlineUsersCount, 
    isLoading: onlineUsersLoading,
    error: onlineUsersError,
    refetch: refetchOnlineUsers,
    isRefetching: isRefetchingOnlineUsers
  } = useGetOnlineUsersCount()

  const { 
    data: userStats, 
    isLoading: userStatsLoading,
    error: userStatsError,
    refetch: refetchUserStats,
    // isRefetching: isRefetchingUserStats
  } = useGetUserStats()

  // Provide fallback values
  const safeOnlineUsersCount = onlineUsersCount ?? 0
  const safeDashboardStats = dashboardStats ?? {
    total: 0,
    role: "admin",
    growthRate: 0,
    newThisMonth: 0
  }
  const safeUserStats = userStats ?? {
    newUsersLastMonth: 0,
    newUsersThisMonth: 0,
    growthRate: 0,
    totalAccounts: 0
  }

  // Type guard to check if an unknown error matches ApiResponse shape
  const isApiResponse = (err: unknown): err is ApiResponse => {
    return !!err && typeof err === 'object' && 'status' in err && typeof (err).status === 'number'
  }

  // Check if any error is a rate limit error
  const isRateLimited = [statsError, onlineUsersError, userStatsError].some(
    (err) => isApiResponse(err) && err.status === 429
  )

  // Handle manual retry
  const handleRetry = () => {
    refetchStats()
    refetchOnlineUsers()
    refetchUserStats()
  }

  if ((statsError || onlineUsersError || userStatsError) && !isRateLimited) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">{t('dashboard.error')}</h3>
          <p className="text-muted-foreground">
            {statsError?.message || onlineUsersError?.message || t('common.error')}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Showing fallback data. Please refresh to try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rate Limit Warning */}
      {isRateLimited && (
        <RateLimitWarning 
          onRetry={handleRetry}
          retryDisabled={isRefetchingStats || isRefetchingOnlineUsers}
        />
      )}

      {/* Header with Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">{t('dashboard.totalUsers')}</p>
              <p className="text-3xl font-bold">{safeUserStats.totalAccounts}</p>
              {isRateLimited && (
                <p className="text-xs text-blue-200 mt-1">• {t('dashboard.cached')} data</p>
              )}
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className={`rounded-lg border p-6 text-white shadow-lg ${
          safeUserStats.growthRate >= 0 
            ? 'bg-gradient-to-r from-green-600 to-green-700' 
            : 'bg-gradient-to-r from-red-600 to-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">{t('dashboard.growthRate')}</p>
              <p className="text-3xl font-bold">
                {safeUserStats.growthRate > 0 ? '+' : ''}{safeUserStats.growthRate.toFixed(1)}%
              </p>
              {isRateLimited && (
                <p className="text-xs text-green-200 mt-1">• {t('dashboard.cached')} data</p>
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">{t('dashboard.newUsersThisMonth')}</p>
              <p className="text-3xl font-bold">+{safeUserStats.newUsersThisMonth}</p>
              {isRateLimited && (
                <p className="text-xs text-purple-200 mt-1">• {t('dashboard.cached')} data</p>
              )}
            </div>
            <Activity className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">{t('dashboard.usersOnline')}</p>
              <p className="text-3xl font-bold">{safeOnlineUsersCount}</p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isRateLimited ? 'bg-orange-300' : 'bg-orange-200 animate-pulse'
                }`}></div>
                <span className="text-xs text-orange-100">
                  {isRateLimited ? t('dashboard.cached') : t('dashboard.live')}
                </span>
              </div>
            </div>
            <PieChart className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Statistics Overview - Using new API */}
        <UserStatsOverview 
          userStats={safeUserStats}
          isLoading={userStatsLoading}
        />

        {/* Growth Trend Chart */}
        <GrowthTrendChart 
          stats={safeDashboardStats}
          isLoading={statsLoading}
        />
      </div>

      {/* Full Width Distribution Chart */}
      <div className="grid gap-6">
        <UserDistributionChart 
          stats={safeDashboardStats}
          onlineCount={safeOnlineUsersCount}
          isLoading={statsLoading || onlineUsersLoading}
        />
      </div>

      {/* Admin Quick Actions */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <h4 className="font-medium text-blue-600">{t('dashboard.userManagement.title')}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {t('dashboard.userManagement.description', '', { count: safeUserStats.totalAccounts })}
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <h4 className="font-medium text-green-600">{t('dashboard.growthAnalysis.title')}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {t('dashboard.growthAnalysis.description', '', { rate: safeUserStats.growthRate.toFixed(1) })}
            </p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <h4 className="font-medium text-purple-600">{t('dashboard.activityMonitor.title')}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {t('dashboard.activityMonitor.description', '', { count: safeOnlineUsersCount })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
