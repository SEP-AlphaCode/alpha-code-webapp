"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import { DashboardUserStats } from "@/types/dashboard"
import { useAdminTranslation } from "@/lib/i18n/hooks/use-translation"

interface UserStatsOverviewProps {
  userStats: DashboardUserStats
  isLoading?: boolean
}

export function UserStatsOverview({ userStats, isLoading }: UserStatsOverviewProps) {
  const { t } = useAdminTranslation()

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const chartData = [
    {
      name: t('dashboard.userStatsOverview.totalAccounts', 'Total Accounts'),
      value: userStats.totalAccounts,
      color: "#3b82f6",
      description: t('dashboard.userStatsOverview.totalAccountsDescription', 'All registered accounts')
    },
    {
      name: t('dashboard.userStatsOverview.newLastMonth', 'New Last Month'),
      value: userStats.newUsersLastMonth,
      color: "#8b5cf6",
      description: t('dashboard.userStatsOverview.newLastMonthDescription', 'Previous month signups')
    },
    {
      name: t('dashboard.userStatsOverview.newThisMonth', 'New This Month'),
      value: userStats.newUsersThisMonth,
      color: "#10b981",
      description: t('dashboard.userStatsOverview.newThisMonthDescription', 'Current month signups')
    }
  ]

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{t('dashboard.userStatsOverview.title', 'User Statistics Overview')}</h3>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium capitalize text-purple-600">{t('dashboard.userStatsOverview.subtitle', 'User Analytics')}</span>
        </div>
      </div>
      
      <div className="h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: string | number, name: string) => [value, name]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{userStats.totalAccounts}</div>
          <div className="text-sm text-blue-700">{t('dashboard.userStatsOverview.totalAccounts', 'Total Accounts')}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{userStats.newUsersLastMonth}</div>
          <div className="text-sm text-purple-700">{t('dashboard.userStatsOverview.lastMonth', 'Last Month')}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">+{userStats.newUsersThisMonth}</div>
          <div className="text-sm text-green-700">{t('dashboard.userStatsOverview.thisMonth', 'This Month')}</div>
        </div>
      </div>
    </div>
  )
}
