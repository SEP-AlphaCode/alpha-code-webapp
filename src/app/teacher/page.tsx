import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function TeacherDashboard() {
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
                            <h1 className="text-xl font-bold text-foreground">AlphaCode</h1>
                            <span className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                Teacher Dashboard
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm">🔔</Button>
                            <Button variant="outline" size="sm">⚙️</Button>
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">TC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {['Overview', 'Robots', 'Students', 'Programming', 'Classroom', 'Analytics'].map((tab, index) => (
                            <button
                                key={tab}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${index === 0
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Robots */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Robots
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">4 online, 8 offline</p>
                        </CardContent>
                    </Card>

                    {/* Active Students */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Students
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">from last 365 days</p>
                        </CardContent>
                    </Card>

                    {/* Lessons Completed */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Lessons Completed
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">156</div>
                            <p className="text-xs text-muted-foreground">across 8 courses</p>
                        </CardContent>
                    </Card>

                    {/* System Health */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                System Health
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">98%</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Student Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Recent Student Activity</CardTitle>
                            <p className="text-sm text-muted-foreground">Latest interactions with Alpha Mini robots</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: 'Emma', action: 'Completed Draw Robot lesson', time: '2 min ago', status: 'success' },
                                    { name: 'Liam', action: 'Started servo sequence', time: '5 min ago', status: 'active' },
                                    { name: 'Sofia', action: 'LED light command', time: '8 min ago', status: 'success' },
                                    { name: 'Noah', action: 'Sensors DE read', time: '12 min ago', status: 'success' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50">
                                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium">{activity.name.slice(0, 2)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{activity.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Robot Fleet Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Robot Fleet Status</CardTitle>
                            <p className="text-sm text-muted-foreground">Real-time status of all Alpha Mini robots</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'Alpha-01', status: 'Online', battery: '94%', classroom: 'Classroom A' },
                                    { id: 'Alpha-02', status: 'Online', battery: '73%', classroom: 'Classroom B' },
                                    { id: 'Alpha-03', status: 'Online', battery: '89%', classroom: 'Classroom C' },
                                    { id: 'Alpha-04', status: 'Offline', battery: '31%', classroom: 'Classroom D' },
                                    { id: 'Alpha-05', status: 'Online', battery: '53%', classroom: 'Classroom B' },
                                    { id: 'Alpha-06', status: 'Online', battery: '40%', classroom: 'Classroom C' },
                                    { id: 'Alpha-07', status: 'Offline', battery: '37%', classroom: 'Charging Station' },
                                    { id: 'Alpha-08', status: 'Offline', battery: '29%', classroom: 'Charging Station' }
                                ].map((robot, index) => (
                                    <div key={index} className="p-3 border border-border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">{robot.id}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${robot.status === 'Online'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                }`}>
                                                {robot.status}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Battery</span>
                                                <span>{robot.battery}</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${parseInt(robot.battery) > 60 ? 'bg-green-600' :
                                                            parseInt(robot.battery) > 30 ? 'bg-yellow-600' : 'bg-red-600'
                                                        }`}
                                                    style={{ width: robot.battery }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{robot.classroom}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
