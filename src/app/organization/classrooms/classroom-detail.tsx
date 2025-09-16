"use client"

import { Classroom } from "@/types/class-entity";
import { MapPin, Bot, Calendar, Users, Play, StopCircle, BarChart3, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClassroomDetail({ classroom }: { classroom: Classroom }) {
  if (!classroom) return <div className="p-6">Classroom not found.</div>;

  return (
    <div className="space-y-6">
      {/* --- Top Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle>{classroom.name}</CardTitle>
            <Badge variant="outline" className="capitalize">
              {classroom.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><Users className="inline-block w-4 h-4 mr-1" /> {classroom.currentStudents}/{classroom.capacity} Students</p>
            <p><Bot className="inline-block w-4 h-4 mr-1" /> {classroom.assignedRobots.length} Robots</p>
            <p><MapPin className="inline-block w-4 h-4 mr-1" /> {classroom.building} • {classroom.room}</p>
            <p>Teacher: {classroom.teacher.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Details Panel --- */}
      <Card>
        <CardHeader>
          <CardTitle>Classroom Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm">
            <p>Status: <Badge className="capitalize">{classroom.status}</Badge></p>
            <p>Capacity: {classroom.capacity}</p>
            <p>Teacher: {classroom.teacher.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-sm">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button className="flex gap-1"><Play className="w-4 h-4" /> Start Session</Button>
              <Button variant="outline" className="flex gap-1"><StopCircle className="w-4 h-4" /> End Session</Button>
              <Button variant="outline" className="flex gap-1"><Bot className="w-4 h-4" /> Control Robots</Button>
              <Button variant="outline" className="flex gap-1"><BarChart3 className="w-4 h-4" /> View Analytics</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Schedule Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {classroom.schedule.length > 0 ? (
              classroom.schedule.map((session, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-purple-50"
                >
                  <p className="font-semibold text-blue-900">{session.subject}</p>
                  <p className="text-sm text-gray-700">
                    {session.day}, {session.startTime} - {session.endTime}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No sessions scheduled.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- Robots Section --- */}
      <Card>
        <CardHeader>
          <CardTitle>Robots in {classroom.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {classroom.assignedRobots.length > 0 ? (
            classroom.assignedRobots.map((robot) => (
              <div
                key={robot.id}
                className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{robot.name}</p>
                  <p className="text-xs capitalize text-gray-500">{robot.status}</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No robots assigned.</p>
          )}
        </CardContent>
      </Card>

      {/* --- Analytics Summary --- */}
      <Card>
        <CardHeader>
          <CardTitle>Classroom Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{classroom.currentStudents}</p>
            <p className="text-xs text-gray-500">Active Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{classroom.assignedRobots.length}</p>
            <p className="text-xs text-gray-500">Active Robots</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{classroom.schedule.length}</p>
            <p className="text-xs text-gray-500">Sessions Today</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
