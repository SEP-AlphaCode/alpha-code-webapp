"use client";

import React, { useState } from 'react';
import { 
  School, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Bot, 
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Settings,
  MoreHorizontal,
  User,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Classroom {
  id: string;
  name: string;
  building: string;
  room: string;
  capacity: number;
  currentStudents: number;
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  assignedRobots: {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'maintenance';
  }[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
  }[];
  activities: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function ClassroomManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);

  // Mock data - replace with real API calls
  const classrooms: Classroom[] = [
    {
      id: '1',
      name: 'Classroom A',
      building: 'Building A',
      room: 'A101',
      capacity: 20,
      currentStudents: 18,
      teacher: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@school.edu'
      },
      assignedRobots: [
        { id: '1', name: 'Alpha-01', status: 'online' },
        { id: '2', name: 'Alpha-02', status: 'offline' }
      ],
      schedule: [
        { day: 'Monday', startTime: '09:00', endTime: '10:30', subject: 'Language Arts' },
        { day: 'Wednesday', startTime: '09:00', endTime: '10:30', subject: 'Science' },
        { day: 'Friday', startTime: '09:00', endTime: '10:30', subject: 'Math' }
      ],
      activities: 45,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Classroom B',
      building: 'Building A',
      room: 'A102',
      capacity: 25,
      currentStudents: 22,
      teacher: {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@school.edu'
      },
      assignedRobots: [
        { id: '3', name: 'Alpha-03', status: 'maintenance' }
      ],
      schedule: [
        { day: 'Tuesday', startTime: '10:00', endTime: '11:30', subject: 'Language Arts' },
        { day: 'Thursday', startTime: '10:00', endTime: '11:30', subject: 'Creative Arts' }
      ],
      activities: 32,
      status: 'active',
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Classroom C',
      building: 'Building B',
      room: 'B201',
      capacity: 15,
      currentStudents: 12,
      teacher: {
        id: '3',
        name: 'Emily Davis',
        email: 'emily.davis@school.edu'
      },
      assignedRobots: [
        { id: '4', name: 'Alpha-04', status: 'online' }
      ],
      schedule: [
        { day: 'Monday', startTime: '14:00', endTime: '15:30', subject: 'STEM' },
        { day: 'Wednesday', startTime: '14:00', endTime: '15:30', subject: 'Social Studies' }
      ],
      activities: 28,
      status: 'active',
      createdAt: '2024-03-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRobotStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteClassroom = (classroomId: string) => {
    if (confirm('Are you sure you want to delete this classroom?')) {
      console.log('Deleting classroom:', classroomId);
    }
  };

  const handleAssignRobot = (classroomId: string) => {
    console.log('Assigning robot to classroom:', classroomId);
  };

  const handleEditSchedule = (classroomId: string) => {
    console.log('Editing schedule for classroom:', classroomId);
  };

  const stats = {
    total: classrooms.length,
    active: classrooms.filter(c => c.status === 'active').length,
    totalStudents: classrooms.reduce((sum, c) => sum + c.currentStudents, 0),
    totalCapacity: classrooms.reduce((sum, c) => sum + c.capacity, 0),
    totalActivities: classrooms.reduce((sum, c) => sum + c.activities, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
          <p className="text-gray-600">Manage classrooms, schedules, and assignments</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Classroom
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classrooms</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Classrooms</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capacity</p>
                <p className="text-2xl font-bold">{stats.totalCapacity}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold">{stats.totalActivities}</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{classroom.name}</CardTitle>
                    <p className="text-sm text-gray-500">{classroom.building} - {classroom.room}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(classroom.status)}>
                  {classroom.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Teacher Info */}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{classroom.teacher.name}</p>
                    <p className="text-xs text-gray-500">{classroom.teacher.email}</p>
                  </div>
                </div>

                {/* Student Capacity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{classroom.currentStudents}/{classroom.capacity}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(classroom.currentStudents / classroom.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Assigned Robots */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Assigned Robots</span>
                  </div>
                  <div className="space-y-1">
                    {classroom.assignedRobots.map((robot) => (
                      <div key={robot.id} className="flex items-center justify-between">
                        <span className="text-sm">{robot.name}</span>
                        <Badge className={getRobotStatusColor(robot.status)} variant="outline">
                          {robot.status}
                        </Badge>
                      </div>
                    ))}
                    {classroom.assignedRobots.length === 0 && (
                      <p className="text-sm text-gray-500">No robots assigned</p>
                    )}
                  </div>
                </div>

                {/* Schedule Preview */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Weekly Schedule</span>
                  </div>
                  <div className="space-y-1">
                    {classroom.schedule.slice(0, 2).map((session, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        <span className="font-medium">{session.day}</span>: {session.startTime}-{session.endTime} ({session.subject})
                      </div>
                    ))}
                    {classroom.schedule.length > 2 && (
                      <p className="text-xs text-gray-500">+{classroom.schedule.length - 2} more sessions</p>
                    )}
                  </div>
                </div>

                {/* Activities Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Activities Completed</span>
                  </div>
                  <span className="text-sm font-medium">{classroom.activities}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditSchedule(classroom.id)}
                    className="flex-1"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAssignRobot(classroom.id)}
                    className="flex-1"
                  >
                    <Bot className="h-3 w-3 mr-1" />
                    Assign Robot
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteClassroom(classroom.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} className="border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">{day}</h4>
                <div className="space-y-1">
                  {classrooms.map((classroom) => {
                    const daySchedule = classroom.schedule.filter(s => s.day === day);
                    return daySchedule.map((session, index) => (
                      <div key={`${classroom.id}-${index}`} className="text-xs p-2 bg-blue-50 rounded">
                        <div className="font-medium">{classroom.name}</div>
                        <div className="text-gray-600">{session.startTime}-{session.endTime}</div>
                        <div className="text-gray-500">{session.subject}</div>
                      </div>
                    ));
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classroom Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Classroom Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classrooms.map((classroom) => (
              <div key={classroom.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <School className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{classroom.name}</p>
                    <p className="text-sm text-gray-500">{classroom.building} - {classroom.room}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">{classroom.currentStudents}/{classroom.capacity}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{classroom.assignedRobots.length}</p>
                    <p className="text-xs text-gray-500">Robots</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{classroom.schedule.length}</p>
                    <p className="text-xs text-gray-500">Sessions/Week</p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(classroom.currentStudents / classroom.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
