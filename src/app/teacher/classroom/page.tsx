"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRobotCommand } from '@/hooks/use-robot-command';

interface Classroom {
    id: string;
    name: string;
    status: 'active' | 'available' | 'maintenance';
    capacity: number;
    currentStudents: number;
    activeRobots: number;
    totalRobots: number;
    currentLesson?: string;
    teacher?: string;
    schedule: {
        time: string;
        subject: string;
        students: number;
    }[];
}

interface Robot {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'busy';
    battery: number;
    classroom: string;
    currentTask?: string;
}

export default function ClassroomPage() {
    const [selectedClassroom, setSelectedClassroom] = useState<string>('classroom-a');
    const [text, setText] = useState('')
    const setNotify = (msg: string, type: "success" | "error") => {
        console.log(`${type === "success" ? "✅" : "❌"} ${msg}`);
        // You can replace this with actual toast notification system later
    };
    const { sendCommandToBackend } = useRobotCommand(setNotify)

    const classrooms: Classroom[] = [
        {
            id: 'classroom-a',
            name: 'Classroom A',
            status: 'active',
            capacity: 30,
            currentStudents: 24,
            activeRobots: 3,
            totalRobots: 4,
            currentLesson: 'Basic Programming',
            teacher: 'Ms. Johnson',
            schedule: [
                { time: '9:00 AM', subject: 'Basic Programming', students: 24 },
                { time: '10:30 AM', subject: 'Robot Control', students: 20 },
                { time: '2:00 PM', subject: 'Advanced Coding', students: 18 }
            ]
        },
        {
            id: 'classroom-b',
            name: 'Classroom B',
            status: 'active',
            capacity: 25,
            currentStudents: 18,
            activeRobots: 2,
            totalRobots: 3,
            currentLesson: 'Sensor Programming',
            teacher: 'Mr. Smith',
            schedule: [
                { time: '8:30 AM', subject: 'Sensor Programming', students: 18 },
                { time: '11:00 AM', subject: 'AI Basics', students: 22 },
                { time: '1:30 PM', subject: 'Robot Dance', students: 15 }
            ]
        },
        {
            id: 'classroom-c',
            name: 'Classroom C',
            status: 'available',
            capacity: 28,
            currentStudents: 0,
            activeRobots: 0,
            totalRobots: 3,
            schedule: [
                { time: '10:00 AM', subject: 'Free Period', students: 0 },
                { time: '1:00 PM', subject: 'Programming Workshop', students: 25 },
                { time: '3:00 PM', subject: 'Robot Maintenance', students: 0 }
            ]
        },
        {
            id: 'classroom-d',
            name: 'Classroom D',
            status: 'maintenance',
            capacity: 20,
            currentStudents: 0,
            activeRobots: 0,
            totalRobots: 2,
            schedule: [
                { time: '9:00 AM', subject: 'Maintenance', students: 0 },
                { time: '2:00 PM', subject: 'Equipment Check', students: 0 }
            ]
        }
    ];

    const robots: Robot[] = [
        { id: 'alpha-01', name: 'Alpha-01', status: 'online', battery: 85, classroom: 'Classroom A', currentTask: 'Teaching basic movements' },
        { id: 'alpha-02', name: 'Alpha-02', status: 'online', battery: 73, classroom: 'Classroom A', currentTask: 'Student interaction' },
        { id: 'alpha-03', name: 'Alpha-03', status: 'busy', battery: 91, classroom: 'Classroom A', currentTask: 'Running program sequence' },
        { id: 'alpha-04', name: 'Alpha-04', status: 'offline', battery: 45, classroom: 'Classroom A' },
        { id: 'alpha-05', name: 'Alpha-05', status: 'online', battery: 67, classroom: 'Classroom B', currentTask: 'Sensor demonstration' },
        { id: 'alpha-06', name: 'Alpha-06', status: 'online', battery: 82, classroom: 'Classroom B', currentTask: 'Voice recognition' },
        { id: 'alpha-07', name: 'Alpha-07', status: 'offline', battery: 23, classroom: 'Classroom B' },
        { id: 'alpha-08', name: 'Alpha-08', status: 'offline', battery: 56, classroom: 'Classroom C' },
        { id: 'alpha-09', name: 'Alpha-09', status: 'offline', battery: 78, classroom: 'Classroom C' },
        { id: 'alpha-10', name: 'Alpha-10', status: 'offline', battery: 34, classroom: 'Classroom C' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'online':
                return 'bg-green-100 text-green-800';
            case 'available':
                return 'bg-blue-100 text-blue-800';
            case 'maintenance':
            case 'offline':
                return 'bg-gray-100 text-gray-800';
            case 'busy':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const selectedClassroomData = classrooms.find(c => c.id === selectedClassroom);
    const classroomRobots = robots.filter(r => r.classroom === selectedClassroomData?.name);

    const s = async (text: string) => {
        console.log('Shit');
        
        await sendCommandToBackend(text, 'EAA007UBT10000341', 'process-text')
    }

    return (
        <div className="space-y-6 p-10" suppressHydrationWarning>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Classroom Management</h1>
                <div className="flex space-x-2">
                    <Button variant="outline" suppressHydrationWarning>
                        📅 Schedule Session
                    </Button>
                    <Button suppressHydrationWarning>
                        ➕ Add Classroom
                    </Button>
                </div>
            </div>
            <div className="flex space-x-2">
                <input
                    type='text'
                    placeholder='Input text to send'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                />
                <button
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                    onClick={(e) => {
                        // Your send logic here
                        s(text)
                    }}
                >
                    Send
                </button>
            </div>

            {/* Classroom Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" suppressHydrationWarning>
                {classrooms.map((classroom) => (
                    <Card
                        key={classroom.id}
                        className={`cursor-pointer transition-all ${selectedClassroom === classroom.id ? 'ring-2 ring-primary' : ''
                            }`}
                        onClick={() => setSelectedClassroom(classroom.id)}
                        suppressHydrationWarning
                    >
                        <CardHeader className="pb-3" suppressHydrationWarning>
                            <div className="flex items-center justify-between" suppressHydrationWarning>
                                <CardTitle className="text-lg" suppressHydrationWarning>{classroom.name}</CardTitle>
                                <Badge className={getStatusColor(classroom.status)} suppressHydrationWarning>
                                    {classroom.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent suppressHydrationWarning>
                            <div className="space-y-3" suppressHydrationWarning>
                                <div className="flex justify-between text-sm" suppressHydrationWarning>
                                    <span className="text-muted-foreground" suppressHydrationWarning>Students:</span>
                                    <span suppressHydrationWarning>{classroom.currentStudents}/{classroom.capacity}</span>
                                </div>
                                <div className="flex justify-between text-sm" suppressHydrationWarning>
                                    <span className="text-muted-foreground" suppressHydrationWarning>Robots:</span>
                                    <span suppressHydrationWarning>{classroom.activeRobots}/{classroom.totalRobots}</span>
                                </div>
                                {classroom.currentLesson && (
                                    <div className="text-sm" suppressHydrationWarning>
                                        <span className="text-muted-foreground" suppressHydrationWarning>Current:</span>
                                        <br />
                                        <span className="font-medium" suppressHydrationWarning>{classroom.currentLesson}</span>
                                    </div>
                                )}
                                {classroom.teacher && (
                                    <div className="text-sm" suppressHydrationWarning>
                                        <span className="text-muted-foreground" suppressHydrationWarning>Teacher:</span>
                                        <br />
                                        <span suppressHydrationWarning>{classroom.teacher}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed View */}
            {selectedClassroomData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" suppressHydrationWarning>
                    {/* Classroom Details */}
                    <Card suppressHydrationWarning>
                        <CardHeader suppressHydrationWarning>
                            <CardTitle suppressHydrationWarning>{selectedClassroomData.name} - Details</CardTitle>
                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                                Real-time classroom information and controls
                            </p>
                        </CardHeader>
                        <CardContent suppressHydrationWarning>
                            <div className="space-y-4" suppressHydrationWarning>
                                {/* Current Status */}
                                <div className="p-4 bg-muted rounded-lg" suppressHydrationWarning>
                                    <h4 className="font-medium mb-2" suppressHydrationWarning>Current Status</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm" suppressHydrationWarning>
                                        <div suppressHydrationWarning>
                                            <span className="text-muted-foreground" suppressHydrationWarning>Status:</span>
                                            <br />
                                            <Badge className={getStatusColor(selectedClassroomData.status)} suppressHydrationWarning>
                                                {selectedClassroomData.status}
                                            </Badge>
                                        </div>
                                        <div suppressHydrationWarning>
                                            <span className="text-muted-foreground" suppressHydrationWarning>Capacity:</span>
                                            <br />
                                            <span suppressHydrationWarning>{selectedClassroomData.currentStudents}/{selectedClassroomData.capacity}</span>
                                        </div>
                                        <div suppressHydrationWarning>
                                            <span className="text-muted-foreground" suppressHydrationWarning>Active Robots:</span>
                                            <br />
                                            <span suppressHydrationWarning>{selectedClassroomData.activeRobots}/{selectedClassroomData.totalRobots}</span>
                                        </div>
                                        <div suppressHydrationWarning>
                                            <span className="text-muted-foreground" suppressHydrationWarning>Teacher:</span>
                                            <br />
                                            <span suppressHydrationWarning>{selectedClassroomData.teacher || 'Not assigned'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div suppressHydrationWarning>
                                    <h4 className="font-medium mb-3" suppressHydrationWarning>Quick Actions</h4>
                                    <div className="grid grid-cols-2 gap-2" suppressHydrationWarning>
                                        <Button variant="outline" size="sm" suppressHydrationWarning>
                                            🎥 Start Session
                                        </Button>
                                        <Button variant="outline" size="sm" suppressHydrationWarning>
                                            ⏹️ End Session
                                        </Button>
                                        <Button variant="outline" size="sm" suppressHydrationWarning>
                                            🤖 Control Robots
                                        </Button>
                                        <Button variant="outline" size="sm" suppressHydrationWarning>
                                            📊 View Analytics
                                        </Button>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div suppressHydrationWarning>
                                    <h4 className="font-medium mb-3" suppressHydrationWarning>Today&apos;s Schedule</h4>
                                    <div className="space-y-2" suppressHydrationWarning>
                                        {selectedClassroomData.schedule.map((session, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 border rounded" suppressHydrationWarning>
                                                <div suppressHydrationWarning>
                                                    <span className="font-medium" suppressHydrationWarning>{session.time}</span>
                                                    <br />
                                                    <span className="text-sm text-muted-foreground" suppressHydrationWarning>{session.subject}</span>
                                                </div>
                                                <div className="text-sm" suppressHydrationWarning>
                                                    👥 {session.students}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Robots in Classroom */}
                    <Card suppressHydrationWarning>
                        <CardHeader suppressHydrationWarning>
                            <CardTitle suppressHydrationWarning>Robots in {selectedClassroomData.name}</CardTitle>
                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                                Manage robots assigned to this classroom
                            </p>
                        </CardHeader>
                        <CardContent suppressHydrationWarning>
                            <div className="space-y-4" suppressHydrationWarning>
                                {classroomRobots.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8" suppressHydrationWarning>
                                        <p suppressHydrationWarning>No robots assigned to this classroom</p>
                                        <Button variant="outline" className="mt-2" suppressHydrationWarning>
                                            Assign Robots
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3" suppressHydrationWarning>
                                        {classroomRobots.map((robot) => (
                                            <div key={robot.id} className="p-3 border rounded-lg" suppressHydrationWarning>
                                                <div className="flex items-center justify-between mb-2" suppressHydrationWarning>
                                                    <span className="font-medium" suppressHydrationWarning>{robot.name}</span>
                                                    <Badge className={getStatusColor(robot.status)} suppressHydrationWarning>
                                                        {robot.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1" suppressHydrationWarning>
                                                    <div className="flex justify-between text-xs" suppressHydrationWarning>
                                                        <span className="text-muted-foreground" suppressHydrationWarning>Battery</span>
                                                        <span suppressHydrationWarning>{robot.battery}%</span>
                                                    </div>
                                                    <div className="w-full bg-muted rounded-full h-1.5" suppressHydrationWarning>
                                                        <div
                                                            className={`h-1.5 rounded-full ${robot.battery > 60 ? 'bg-green-600' :
                                                                robot.battery > 30 ? 'bg-yellow-600' : 'bg-red-600'
                                                                }`}
                                                            style={{ width: `${robot.battery}%` }}
                                                            suppressHydrationWarning
                                                        ></div>
                                                    </div>
                                                    {robot.currentTask && (
                                                        <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                                                            Task: {robot.currentTask}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 mt-2" suppressHydrationWarning>
                                                    <Button variant="outline" size="sm" suppressHydrationWarning>
                                                        Control
                                                    </Button>
                                                    <Button variant="outline" size="sm" suppressHydrationWarning>
                                                        Program
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Classroom Analytics Summary */}
            <Card suppressHydrationWarning>
                <CardHeader suppressHydrationWarning>
                    <CardTitle suppressHydrationWarning>Classroom Analytics Summary</CardTitle>
                    <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                        Overall performance across all classrooms today
                    </p>
                </CardHeader>
                <CardContent suppressHydrationWarning>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6" suppressHydrationWarning>
                        <div className="text-center" suppressHydrationWarning>
                            <div className="text-2xl font-bold text-green-600" suppressHydrationWarning>2</div>
                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>Active Classrooms</p>
                        </div>
                        <div className="text-center" suppressHydrationWarning>
                            <div className="text-2xl font-bold text-blue-600" suppressHydrationWarning>42</div>
                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>Total Students</p>
                        </div>
                        <div className="text-center" suppressHydrationWarning>
                            <div className="text-2xl font-bold text-purple-600" suppressHydrationWarning>5</div>
                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>Active Robots</p>
                        </div>
                        <div className="text-center" suppressHydrationWarning>
                            <div className="text-2xl font-bold text-orange-600" suppressHydrationWarning>8</div>
                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>Sessions Today</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
