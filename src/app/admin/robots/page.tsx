"use client";

import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Settings, 
  Power, 
  PowerOff,
  Wifi,
  WifiOff,
  Battery,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Robot {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance' | 'charging';
  battery: number;
  location: string;
  classroom?: string;
  lastSeen: string;
  firmware: string;
  ipAddress: string;
  functions: string[];
  uptime: string;
  temperature: number;
}

export default function RobotManagement() {
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with real API calls
  const robots: Robot[] = [
    {
      id: '1',
      name: 'Alpha-01',
      model: 'Alpha Mini v2.0',
      status: 'online',
      battery: 85,
      location: 'Building A',
      classroom: 'Classroom A',
      lastSeen: '2024-08-18 10:30:00',
      firmware: 'v1.2.3',
      ipAddress: '192.168.1.101',
      functions: ['voice_recognition', 'face_detection', 'qr_scanner', 'dance'],
      uptime: '7d 12h 45m',
      temperature: 42
    },
    {
      id: '2',
      name: 'Alpha-02',
      model: 'Alpha Mini v2.0',
      status: 'charging',
      battery: 23,
      location: 'Building A',
      classroom: 'Classroom B',
      lastSeen: '2024-08-18 09:15:00',
      firmware: 'v1.2.3',
      ipAddress: '192.168.1.102',
      functions: ['voice_recognition', 'face_detection', 'qr_scanner'],
      uptime: '2d 8h 32m',
      temperature: 38
    },
    {
      id: '3',
      name: 'Alpha-03',
      model: 'Alpha Mini v2.0',
      status: 'maintenance',
      battery: 0,
      location: 'Tech Room',
      lastSeen: '2024-08-17 16:45:00',
      firmware: 'v1.2.2',
      ipAddress: '192.168.1.103',
      functions: ['voice_recognition', 'face_detection'],
      uptime: '0m',
      temperature: 25
    },
    {
      id: '4',
      name: 'Alpha-04',
      model: 'Alpha Mini v2.0',
      status: 'online',
      battery: 67,
      location: 'Building B',
      classroom: 'Classroom C',
      lastSeen: '2024-08-18 10:25:00',
      firmware: 'v1.2.3',
      ipAddress: '192.168.1.104',
      functions: ['voice_recognition', 'face_detection', 'qr_scanner', 'dance', 'storytelling'],
      uptime: '5d 3h 12m',
      temperature: 45
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'charging': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'offline': return <PowerOff className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      case 'charging': return <Battery className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600';
    if (battery > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handlePowerToggle = (robotId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'online' ? 'offline' : 'online';
    console.log('Toggling robot power:', robotId, newStatus);
  };

  const handleAssignClassroom = (robotId: string) => {
    console.log('Assigning classroom to robot:', robotId);
  };

  const handleUpdateFunctions = (robotId: string) => {
    console.log('Updating robot functions:', robotId);
  };

  const stats = {
    total: robots.length,
    online: robots.filter(r => r.status === 'online').length,
    offline: robots.filter(r => r.status === 'offline').length,
    maintenance: robots.filter(r => r.status === 'maintenance').length,
    charging: robots.filter(r => r.status === 'charging').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Robot Management</h1>
          <p className="text-gray-600">Monitor and manage Alpha Mini robots</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Robot
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Robots</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">{stats.online}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Charging</p>
                <p className="text-2xl font-bold text-blue-600">{stats.charging}</p>
              </div>
              <Battery className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">{stats.offline}</p>
              </div>
              <PowerOff className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Robots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {robots.map((robot) => (
          <Card key={robot.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{robot.name}</CardTitle>
                    <p className="text-sm text-gray-500">{robot.model}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(robot.status)}>
                  {getStatusIcon(robot.status)}
                  <span className="ml-1">{robot.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Battery and Temperature */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(robot.battery)}`} />
                    <span className="text-sm font-medium">{robot.battery}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          robot.battery > 60 ? 'bg-green-500' : 
                          robot.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${robot.battery}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{robot.temperature}°C</div>
                </div>

                {/* Location and Classroom */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{robot.location}</span>
                  </div>
                  {robot.classroom && (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{robot.classroom}</span>
                    </div>
                  )}
                </div>

                {/* Network Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    {robot.status === 'online' ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span>{robot.ipAddress}</span>
                  </div>
                  <span>{robot.firmware}</span>
                </div>

                {/* Functions */}
                <div>
                  <p className="text-sm font-medium mb-2">Active Functions:</p>
                  <div className="flex flex-wrap gap-1">
                    {robot.functions.map((func) => (
                      <Badge key={func} variant="outline" className="text-xs">
                        {func.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Last Seen and Uptime */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Last seen: {new Date(robot.lastSeen).toLocaleString()}</span>
                  </div>
                  <div>Uptime: {robot.uptime}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant={robot.status === 'online' ? 'outline' : 'default'}
                    onClick={() => handlePowerToggle(robot.id, robot.status)}
                    className="flex-1"
                  >
                    {robot.status === 'online' ? (
                      <>
                        <PowerOff className="h-3 w-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUpdateFunctions(robot.id)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAssignClassroom(robot.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Network Health</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Online Robots</span>
                  <span className="text-green-600">{stats.online}/{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Network Latency</span>
                  <span>12ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data Transfer</span>
                  <span>1.2 MB/s</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg. Response Time</span>
                  <span>1.3s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="text-green-600">98.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Error Rate</span>
                  <span className="text-red-600">1.3%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Maintenance Schedule</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next Maintenance</span>
                  <span>Aug 25, 2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Firmware Updates</span>
                  <span className="text-blue-600">Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>System Health</span>
                  <span className="text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
