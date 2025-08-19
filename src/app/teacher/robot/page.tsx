"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { 
  Battery, 
  WifiOff, 
  Power, 
  Settings, 
  Activity,
  MapPin,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function RobotManagement() {
    const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mock robot data
    const robots = [
        {
            id: 'Alpha-01',
            name: 'Alpha Mini 01',
            status: 'online',
            battery: 94,
            location: 'Classroom A',
            lastSeen: '2 minutes ago',
            version: 'v2.1.3',
            students: 6,
            currentTask: 'Teaching Colors',
            uptime: '4h 23m',
            ip: '192.168.1.101',
            temperature: 32
        },
        {
            id: 'Alpha-02',
            name: 'Alpha Mini 02',
            status: 'online',
            battery: 73,
            location: 'Classroom B',
            lastSeen: '1 minute ago',
            version: 'v2.1.3',
            students: 4,
            currentTask: 'Programming Basics',
            uptime: '3h 45m',
            ip: '192.168.1.102',
            temperature: 29
        },
        {
            id: 'Alpha-03',
            name: 'Alpha Mini 03',
            status: 'online',
            battery: 89,
            location: 'Classroom C',
            lastSeen: '3 minutes ago',
            version: 'v2.1.2',
            students: 8,
            currentTask: 'Shape Recognition',
            uptime: '6h 12m',
            ip: '192.168.1.103',
            temperature: 31
        },
        {
            id: 'Alpha-04',
            name: 'Alpha Mini 04',
            status: 'offline',
            battery: 31,
            location: 'Classroom D',
            lastSeen: '15 minutes ago',
            version: 'v2.1.3',
            students: 0,
            currentTask: 'Idle',
            uptime: '0h 0m',
            ip: '192.168.1.104',
            temperature: 25
        },
        {
            id: 'Alpha-05',
            name: 'Alpha Mini 05',
            status: 'charging',
            battery: 53,
            location: 'Charging Station',
            lastSeen: '5 minutes ago',
            version: 'v2.1.3',
            students: 0,
            currentTask: 'Charging',
            uptime: '0h 0m',
            ip: '192.168.1.105',
            temperature: 28
        },
        {
            id: 'Alpha-06',
            name: 'Alpha Mini 06',
            status: 'maintenance',
            battery: 40,
            location: 'Workshop',
            lastSeen: '1 hour ago',
            version: 'v2.1.1',
            students: 0,
            currentTask: 'System Update',
            uptime: '0h 0m',
            ip: '192.168.1.106',
            temperature: 26
        },
        {
            id: 'Alpha-07',
            name: 'Alpha Mini 07',
            status: 'online',
            battery: 67,
            location: 'Classroom A',
            lastSeen: 'Just now',
            version: 'v2.1.3',
            students: 5,
            currentTask: 'Social Skills',
            uptime: '2h 18m',
            ip: '192.168.1.107',
            temperature: 30
        },
        {
            id: 'Alpha-08',
            name: 'Alpha Mini 08',
            status: 'offline',
            battery: 29,
            location: 'Storage',
            lastSeen: '2 hours ago',
            version: 'v2.1.2',
            students: 0,
            currentTask: 'Idle',
            uptime: '0h 0m',
            ip: '192.168.1.108',
            temperature: 24
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'offline':
                return <WifiOff className="h-4 w-4 text-gray-500" />;
            case 'charging':
                return <Zap className="h-4 w-4 text-yellow-500" />;
            case 'maintenance':
                return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-100 text-green-800';
            case 'offline':
                return 'bg-gray-100 text-gray-800';
            case 'charging':
                return 'bg-yellow-100 text-yellow-800';
            case 'maintenance':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBatteryColor = (battery: number) => {
        if (battery > 60) return 'bg-green-500';
        if (battery > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const onlineRobots = robots.filter(robot => robot.status === 'online').length;
    const offlineRobots = robots.filter(robot => robot.status === 'offline').length;
    const chargingRobots = robots.filter(robot => robot.status === 'charging').length;
    // const maintenanceRobots = robots.filter(robot => robot.status === 'maintenance').length;
    const totalStudents = robots.reduce((sum, robot) => sum + robot.students, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                                <Image
                                    src="/alphacodelogo.png"
                                    alt="Alpha Logo"
                                    width={64}
                                    height={64}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Robot Management</h1>
                                <span className="text-sm text-muted-foreground">
                                    Monitor and control Alpha Mini robots
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Robot
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Robots</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{robots.length}</div>
                            <p className="text-xs text-muted-foreground">Alpha Mini fleet</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Online</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{onlineRobots}</div>
                            <p className="text-xs text-muted-foreground">Active robots</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Offline</CardTitle>
                            <WifiOff className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{offlineRobots}</div>
                            <p className="text-xs text-muted-foreground">Inactive robots</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Charging</CardTitle>
                            <Zap className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{chargingRobots}</div>
                            <p className="text-xs text-muted-foreground">Charging now</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Students</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
                            <p className="text-xs text-muted-foreground">Currently learning</p>
                        </CardContent>
                    </Card>
                </div>

                {/* View Controls */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Robot Fleet</h2>
                    <div className="flex space-x-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            Grid View
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            List View
                        </Button>
                    </div>
                </div>

                {/* Robot Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {robots.map((robot) => (
                            <Card 
                                key={robot.id} 
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                    selectedRobot === robot.id ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setSelectedRobot(selectedRobot === robot.id ? null : robot.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{robot.name}</CardTitle>
                                        {getStatusIcon(robot.status)}
                                    </div>
                                    <Badge className={getStatusColor(robot.status)}>
                                        {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Battery</span>
                                        <div className="flex items-center space-x-2">
                                            <Battery className="h-4 w-4" />
                                            <span className="text-sm font-medium">{robot.battery}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getBatteryColor(robot.battery)}`}
                                            style={{ width: `${robot.battery}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Location:</span>
                                            <span>{robot.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Students:</span>
                                            <span>{robot.students}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Task:</span>
                                            <span className="truncate max-w-24">{robot.currentTask}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Uptime:</span>
                                            <span>{robot.uptime}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 pt-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Settings className="h-4 w-4 mr-1" />
                                            Control
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1">
                                            <Activity className="h-4 w-4 mr-1" />
                                            Monitor
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Robot List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {robots.map((robot) => (
                                    <div 
                                        key={robot.id}
                                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                                            selectedRobot === robot.id ? 'bg-primary/5 border-primary' : ''
                                        }`}
                                        onClick={() => setSelectedRobot(selectedRobot === robot.id ? null : robot.id)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(robot.status)}
                                                <div>
                                                    <h3 className="font-semibold">{robot.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{robot.id}</p>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(robot.status)}>
                                                {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-5 gap-8 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Battery</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-16 bg-muted rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${getBatteryColor(robot.battery)}`}
                                                            style={{ width: `${robot.battery}%` }}
                                                        ></div>
                                                    </div>
                                                    <span>{robot.battery}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Location</p>
                                                <p className="font-medium">{robot.location}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Students</p>
                                                <p className="font-medium">{robot.students}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Current Task</p>
                                                <p className="font-medium">{robot.currentTask}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Last Seen</p>
                                                <p className="font-medium">{robot.lastSeen}</p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline">
                                                <Settings className="h-4 w-4 mr-1" />
                                                Control
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Activity className="h-4 w-4 mr-1" />
                                                Monitor
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Selected Robot Details */}
                {selectedRobot && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Robot Details - {robots.find(r => r.id === selectedRobot)?.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(() => {
                                    const robot = robots.find(r => r.id === selectedRobot);
                                    if (!robot) return null;
                                    
                                    return (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg">System Information</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Robot ID:</span>
                                                        <span>{robot.id}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Firmware Version:</span>
                                                        <span>{robot.version}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">IP Address:</span>
                                                        <span>{robot.ip}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Temperature:</span>
                                                        <span>{robot.temperature}°C</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Uptime:</span>
                                                        <span>{robot.uptime}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg">Current Status</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Status:</span>
                                                        <Badge className={getStatusColor(robot.status)}>
                                                            {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Current Task:</span>
                                                        <span>{robot.currentTask}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Active Students:</span>
                                                        <span>{robot.students}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Location:</span>
                                                        <span>{robot.location}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Last Seen:</span>
                                                        <span>{robot.lastSeen}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-lg">Quick Actions</h4>
                                                <div className="space-y-2">
                                                    <Button className="w-full" variant="outline">
                                                        <Power className="h-4 w-4 mr-2" />
                                                        Restart Robot
                                                    </Button>
                                                    <Button className="w-full" variant="outline">
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Robot Settings
                                                    </Button>
                                                    <Button className="w-full" variant="outline">
                                                        <Activity className="h-4 w-4 mr-2" />
                                                        System Diagnostics
                                                    </Button>
                                                    <Button className="w-full" variant="outline">
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        Update Firmware
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
