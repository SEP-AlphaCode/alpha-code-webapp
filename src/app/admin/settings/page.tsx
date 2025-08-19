"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Bell,
  Shield,
  Database,
  Wifi,
  Bot,
  Mail,
  Smartphone,
  HardDrive,
  Activity,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // Mock settings data - replace with real API calls
  const [settings, setSettings] = useState({
    general: {
      systemName: 'AlphaCode Education Platform',
      organizationName: 'ABC Preschool',
      timezone: 'UTC+7',
      language: 'English',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      systemAlerts: true,
      userRegistrations: true,
      robotStatus: true,
      classroomUpdates: false,
      maintenanceAlerts: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      ipWhitelist: '',
      dataEncryption: true,
      auditLogging: true
    },
    robots: {
      defaultFunctions: ['voice_recognition', 'face_detection'],
      maxRobotsPerClassroom: 3,
      batteryAlertThreshold: 20,
      maintenanceInterval: 7,
      autoUpdate: true,
      dataCollectionEnabled: true,
      privacyMode: false,
      defaultVolume: 70
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 90,
      performanceMonitoring: true,
      errorReporting: true,
      systemUpdates: 'auto',
      maintenanceWindow: '02:00-04:00',
      maxConcurrentUsers: 100
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'robots', name: 'Robot Settings', icon: Bot },
    { id: 'system', name: 'System', icon: Database }
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      console.log('Resetting settings to defaults...');
    }
  };

  const updateSetting = (category: string, key: string, value: boolean | string | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and security settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">System Health</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Uptime</p>
                <p className="text-sm text-gray-600">99.8%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Storage</p>
                <p className="text-sm text-gray-600">2.4 TB / 5 TB</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Network</p>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Name
                      </label>
                      <Input
                        value={settings.general.systemName}
                        onChange={(e) => updateSetting('general', 'systemName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <Input
                        value={settings.general.organizationName}
                        onChange={(e) => updateSetting('general', 'organizationName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="UTC+7">UTC+7 (Bangkok)</option>
                        <option value="UTC+0">UTC+0 (London)</option>
                        <option value="UTC-5">UTC-5 (New York)</option>
                        <option value="UTC-8">UTC-8 (Los Angeles)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="English">English</option>
                        <option value="Thai">Thai</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Notification Channels</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.notifications.smsNotifications}
                            onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Smartphone className="h-4 w-4 text-gray-400" />
                          <span>SMS Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Bell className="h-4 w-4 text-gray-400" />
                          <span>Push Notifications</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Alert Types</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.notifications.systemAlerts}
                            onChange={(e) => updateSetting('notifications', 'systemAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>System Alerts</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.notifications.robotStatus}
                            onChange={(e) => updateSetting('notifications', 'robotStatus', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Robot Status Updates</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.notifications.maintenanceAlerts}
                            onChange={(e) => updateSetting('notifications', 'maintenanceAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Maintenance Alerts</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Password Policy</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Password Length
                          </label>
                          <Input
                            type="number"
                            min="6"
                            max="20"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                          />
                        </div>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.security.requireSpecialChars}
                            onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Require Special Characters</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Two-Factor Authentication</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Session Management</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <Input
                            type="number"
                            min="5"
                            max="480"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Login Attempts
                          </label>
                          <Input
                            type="number"
                            min="3"
                            max="10"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          />
                        </div>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.security.auditLogging}
                            onChange={(e) => updateSetting('security', 'auditLogging', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Audit Logging</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'robots' && (
            <Card>
              <CardHeader>
                <CardTitle>Robot Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Default Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Robots per Classroom
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={settings.robots.maxRobotsPerClassroom}
                            onChange={(e) => updateSetting('robots', 'maxRobotsPerClassroom', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Battery Alert Threshold (%)
                          </label>
                          <Input
                            type="number"
                            min="10"
                            max="50"
                            value={settings.robots.batteryAlertThreshold}
                            onChange={(e) => updateSetting('robots', 'batteryAlertThreshold', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Volume (%)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={settings.robots.defaultVolume}
                            onChange={(e) => updateSetting('robots', 'defaultVolume', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">System Options</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.robots.autoUpdate}
                            onChange={(e) => updateSetting('robots', 'autoUpdate', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Auto-update Robot Firmware</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.robots.dataCollectionEnabled}
                            onChange={(e) => updateSetting('robots', 'dataCollectionEnabled', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Data Collection</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.robots.privacyMode}
                            onChange={(e) => updateSetting('robots', 'privacyMode', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Privacy Mode</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Backup & Maintenance</h4>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.system.autoBackup}
                            onChange={(e) => updateSetting('system', 'autoBackup', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Auto Backup</span>
                        </label>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Backup Frequency
                          </label>
                          <select
                            value={settings.system.backupFrequency}
                            onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data Retention (days)
                          </label>
                          <Input
                            type="number"
                            min="30"
                            max="365"
                            value={settings.system.retentionPeriod}
                            onChange={(e) => updateSetting('system', 'retentionPeriod', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Performance</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Concurrent Users
                          </label>
                          <Input
                            type="number"
                            min="50"
                            max="1000"
                            value={settings.system.maxConcurrentUsers}
                            onChange={(e) => updateSetting('system', 'maxConcurrentUsers', parseInt(e.target.value))}
                          />
                        </div>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.system.performanceMonitoring}
                            onChange={(e) => updateSetting('system', 'performanceMonitoring', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Performance Monitoring</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={settings.system.errorReporting}
                            onChange={(e) => updateSetting('system', 'errorReporting', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enable Error Reporting</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
