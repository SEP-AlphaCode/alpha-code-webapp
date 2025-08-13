'use client';

import { useState } from 'react';
import { useAuth, demoUsers } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import Link from 'next/link';
import { Users, GraduationCap, Shield, Briefcase } from 'lucide-react';

export default function DemoPage() {
  const { user, login, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roleConfig = {
    [UserRole.PARENT]: {
      title: 'Parent Portal',
      description: 'Monitor your children\'s learning progress with AlphaCode',
      icon: Users,
      color: 'bg-blue-500',
      features: ['Track learning progress', 'View achievements', 'Communicate with teachers', 'Schedule management']
    },
    [UserRole.TEACHER]: {
      title: 'Teacher Dashboard',
      description: 'Manage classes and interact with Alpha Mini robot',
      icon: GraduationCap,
      color: 'bg-green-500',
      features: ['Control Alpha Mini robot', 'Create lesson plans', 'Monitor student progress', 'Classroom management']
    },
    [UserRole.ADMIN]: {
      title: 'System Administration',
      description: 'Manage platform infrastructure and user accounts',
      icon: Shield,
      color: 'bg-red-500',
      features: ['User management', 'System monitoring', 'Robot fleet management', 'Security controls']
    },
    [UserRole.MANAGER]: {
      title: 'Management Dashboard',
      description: 'Strategic overview and business intelligence',
      icon: Briefcase,
      color: 'bg-purple-500',
      features: ['Financial analytics', 'Performance metrics', 'Strategic planning', 'Growth tracking']
    }
  };

  const handleRoleLogin = (role: UserRole) => {
    const demoUser = demoUsers.find(u => u.role === role);
    if (demoUser) {
      login(demoUser);
    }
  };

  if (user) {
    const roleLinks = {
      [UserRole.PARENT]: '/parent',
      [UserRole.TEACHER]: '/teacher',
      [UserRole.ADMIN]: '/admin',
      [UserRole.MANAGER]: '/manager'
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-2xl">α</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AlphaCode Platform
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You are logged in as <strong>{user.name}</strong> ({user.role})
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <Link
                href={roleLinks[user.role]}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to {roleConfig[user.role].title}
              </Link>
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Switch User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
              <span className="text-white font-bold text-3xl">α</span>
            </div>
            <h1 className="text-5xl font-bold">AlphaCode</h1>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            An interactive physical programming system that combines Alpha Mini Robot with tangible coding blocks. 
            Bringing computational thinking to preschoolers through playful, hands-on learning experiences.
          </p>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white bg-opacity-10 rounded p-3">
                <strong>Screen-Free Learning:</strong> Physical blocks eliminate digital overwhelm
              </div>
              <div className="bg-white bg-opacity-10 rounded p-3">
                <strong>Social Robot Interaction:</strong> Alpha Mini makes learning engaging
              </div>
              <div className="bg-white bg-opacity-10 rounded p-3">
                <strong>Age-Appropriate:</strong> Designed specifically for preschool development
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Role
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore different user interfaces designed for each stakeholder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(roleConfig).map(([role, config]) => (
            <div
              key={role}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`${config.color} p-6 text-white`}>
                <config.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">{config.title}</h3>
                <p className="text-sm opacity-90">{config.description}</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {config.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleRoleLogin(role as UserRole)}
                  className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Built with Modern Technology
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">⚛️</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Next.js 14</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">🎨</span>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailwind CSS</p>
            </div>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">🤖</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Alpha Mini Robot</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">📱</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsive Design</p>
          </div>
        </div>
      </div>
    </div>
  );
}
