"use client"

import { useState } from "react"
import { School, Edit, Trash2, Users, Calendar, BookOpen, User, GraduationCap, Plus, Award, Clock, MapPin, Bot, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import dayjs from "dayjs"
import { ClassDto, Classroom, ClassStatus, getStatusColor } from "@/types/class-entity"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useClassroom } from "@/hooks/organization/use-class"


import ClassroomDetail from "./classroom-detail";
import { Input } from "@/components/ui/input"

export default function ClassroomMainPage() {
  const classroomHooks = useClassroom()
  const { data: classroomsResponse, isLoading, error } = classroomHooks.useGetAllClassrooms(1, 100)
  const classrooms = classroomsResponse?.data || []
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading classrooms...</div>
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        Error loading classrooms: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <School className="w-5 h-5 text-blue-600" />
          Classrooms
        </h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Classroom
        </Button>
      </div>

      {/* Classroom navigation */}
      <nav
        className="flex flex-row gap-2 overflow-x-auto pb-2"
        style={{ scrollbarColor: "#9ca3af #f3f4f6" }}
      >
        {classrooms.map((c, idx) => (
          <button
            key={c.id}
            className={`min-w-[180px] px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 border border-primary/50 hover:border-primary whitespace-nowrap 
              ${selectedIndex === idx ? "bg-gray-900 text-white" : "text-gray-500"}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-base truncate">{c.name}</span>
              <span className="text-xs truncate max-w-[140px]" title={c.teacher.name}>
                {c.teacher.name}
              </span>
              <span className="text-xs">{c.currentStudents} students</span>
            </div>
          </button>
        ))}
      </nav>

      {/* Selected classroom details */}
      <div className="flex-1">
        <ClassroomDetail classroom={classrooms[selectedIndex]} />
      </div>
    </div>
  )
}