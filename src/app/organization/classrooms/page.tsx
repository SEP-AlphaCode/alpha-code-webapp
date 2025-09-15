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
  const [search, setSearch] = useState("")

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading classrooms...</div>
  }
  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-600">Error: {error.message}</div>
  }

  // Filter classrooms by search (name or teacher)
  const filteredClassrooms = classrooms.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <School className="w-5 h-5 text-blue-600" />
          Classrooms
        </h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search classrooms..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of classrooms */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredClassrooms.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No classrooms found.
          </div>
        ) : (
          filteredClassrooms.map((c, idx) => (
            <Card
              key={c.id}
              className={`cursor-pointer transition-all duration-200 border 
                ${selectedIndex === idx ? "border-blue-500 shadow-lg" : "hover:border-blue-300"}`}
              onClick={() => setSelectedIndex(idx)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  {c.name}
                  <Badge
                    className={`${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : c.status === "inactive"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  <span className="truncate">{c.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>
                    {c.currentStudents}/{c.capacity} students
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Selected classroom details */}
      <div>
        {classrooms[selectedIndex] ? (
          <ClassroomDetail classroom={classrooms[selectedIndex]} />
        ) : (
          <div className="p-6 text-gray-500">Select a classroom to see details</div>
        )}
      </div>
    </div>
  )
}