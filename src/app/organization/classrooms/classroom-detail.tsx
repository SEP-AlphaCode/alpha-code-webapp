"use client"

import { Classroom } from "@/types/class-entity";
import { MapPin, Bot, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClassroomDetail({ classroom }: { classroom: Classroom }) {
  if (!classroom) return <div className="p-6">Classroom not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Left: class content (7/10) */}
      <div className="space-y-6 lg:col-span-7">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm bg-blue-100 text-blue-600">
            {classroom.name.split(" ").map(n => n[0]).join("").toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">{classroom.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <MapPin className="h-3 w-3" />
              <span>{classroom.building} • {classroom.room}</span>
              <Badge className="bg-green-100 text-green-800">
                {classroom.status.charAt(0).toUpperCase() + classroom.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">Teacher: {classroom.teacher.name}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-row flex-wrap gap-6 items-center py-1">
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="font-semibold text-xs text-gray-700">Students</span>
            <span className="text-blue-600 text-sm">
              {classroom.currentStudents}/{classroom.capacity}
            </span>
          </div>
          <div className="flex flex-col items-center min-w-[60px]">
            <Bot className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-sm font-semibold">{classroom.assignedRobots.length}</span>
            <span className="text-xs text-gray-500">Robots</span>
          </div>
          <div className="flex flex-col items-center min-w-[60px]">
            <Calendar className="h-5 w-5 text-purple-500 mb-1" />
            <span className="text-sm font-semibold">{classroom.schedule.length}</span>
            <span className="text-xs text-gray-500">Sessions</span>
          </div>
        </div>

        {/* Schedule */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs">
            <thead>
              <tr className="bg-blue-100">
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                  <th key={day} className="px-6 py-3 font-medium text-blue-900 border border-blue-200">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => {
                  const sessions = classroom.schedule.filter(s => s.day === day)
                  return (
                    <td key={day} className="text-center align-top px-3 py-3 border border-blue-100 w-40">
                      {sessions.length > 0 ? (
                        sessions.map((session, idx) => (
                          <div key={idx} className="mb-5">
                            <span className="block text-blue-900 font-semibold">
                              {session.startTime} - {session.endTime}
                            </span>
                            <span className="block text-blue-700">{session.subject}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-blue-200">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: quick actions (3/10) */}
      <div className="lg:col-span-3">
        <div className="bg-white shadow rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Quick Actions</h4>
          <button className="w-full px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Start New Lesson
          </button>
          <button className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
            Schedule Activity
          </button>
          <button className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
            Classroom Settings
          </button>
          <button className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
            Take Photo
          </button>
        </div>
      </div>
    </div>
  );
}
