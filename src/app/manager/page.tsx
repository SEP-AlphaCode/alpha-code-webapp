'use client';

import { ManagerLayout } from '@/components/layouts';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, DollarSign, Users, Building2, Globe, Target } from 'lucide-react';

export default function ManagerDashboard() {
  const { user } = useAuth();

  const kpis = [
    {
      title: 'Revenue Growth',
      value: '127%',
      change: '+15.2%',
      trend: 'up',
      target: '120%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Market Penetration',
      value: '23.8%',
      change: '+5.1%',
      trend: 'up',
      target: '25%',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Customer Acquisition',
      value: '2,847',
      change: '+18.9%',
      trend: 'up',
      target: '3,000',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Global Expansion',
      value: '12',
      change: '+3',
      trend: 'up',
      target: '15',
      icon: Globe,
      color: 'text-orange-600'
    }
  ];

  const regionalData = [
    { region: 'North America', revenue: '$524K', growth: '+24.5%', schools: 156, trend: 'up' },
    { region: 'Europe', revenue: '$387K', growth: '+18.2%', schools: 89, trend: 'up' },
    { region: 'Asia Pacific', revenue: '$298K', growth: '+31.7%', schools: 67, trend: 'up' },
    { region: 'Latin America', revenue: '$156K', growth: '+12.4%', schools: 34, trend: 'up' }
  ];

  const strategicInitiatives = [
    {
      name: 'AI Enhancement Project',
      progress: 78,
      status: 'on-track',
      deadline: 'Q1 2025',
      budget: '$2.3M',
      team: 12
    },
    {
      name: 'Global Expansion Phase 2',
      progress: 65,
      status: 'ahead',
      deadline: 'Q2 2025',
      budget: '$5.7M',
      team: 25
    },
    {
      name: 'Product Innovation Lab',
      progress: 45,
      status: 'on-track',
      deadline: 'Q3 2025',
      budget: '$1.8M',
      team: 8
    }
  ];

  return (
    <ManagerLayout user={user || undefined}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Executive Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Strategic overview and key performance indicators for AlphaCode platform
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  kpi.trend === 'up' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {kpi.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {kpi.value}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Target: {kpi.target}</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Regional Performance & Strategic Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Regional Performance */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Regional Performance
            </h3>
            <div className="space-y-4">
              {regionalData.map((region, index) => (
                <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {region.region}
                    </h4>
                    <span className="text-sm text-green-600 font-medium">
                      {region.growth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {region.revenue}
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {region.schools} schools
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Initiatives */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Strategic Initiatives
            </h3>
            <div className="space-y-4">
              {strategicInitiatives.map((initiative, index) => (
                <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {initiative.name}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      initiative.status === 'ahead' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {initiative.status === 'ahead' ? 'Ahead' : 'On Track'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{initiative.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${initiative.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Budget: {initiative.budget}</span>
                    <span>Team: {initiative.team}</span>
                    <span>Due: {initiative.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financial Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Quarterly Revenue
              </h4>
              <p className="text-2xl font-bold text-green-600">$1.365M</p>
              <p className="text-sm text-green-600">+27% vs Q3</p>
            </div>
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Operating Margin
              </h4>
              <p className="text-2xl font-bold text-blue-600">23.8%</p>
              <p className="text-sm text-blue-600">+2.1% improvement</p>
            </div>
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Customer LTV
              </h4>
              <p className="text-2xl font-bold text-purple-600">$4,250</p>
              <p className="text-sm text-purple-600">+15% increase</p>
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}
