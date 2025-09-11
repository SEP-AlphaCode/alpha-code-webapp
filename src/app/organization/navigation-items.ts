import { Building, School, GraduationCap, Users, Server, Bot, Monitor, Activity } from "lucide-react"

export const navigationItems = [
  {
    name: "Overview",
    url: "/organization",
    icon: Building,
  },
  {
    name: "Classrooms",
    url: "/organization/classrooms",
    icon: School,
  },
  {
    name: "Teachers",
    url: "/organization/teachers",
    icon: GraduationCap,
  },
  {
    name: "Students",
    url: "/organization/students",
    icon: Users,
  },
  {
    name: "Spaces",
    url: "/organization/spaces",
    icon: Server,
    description: "Physical Locations",
    color: "bg-teal-500",
  },
  {
    name: "Robots",
    url: "/organization/robots",
    icon: Bot,
    description: "Robot Fleet",
    color: "bg-indigo-500",
  },
  {
    name: "Devices",
    url: "/organization/devices",
    icon: Monitor,
    description: "Hardware Management",
    color: "bg-gray-500",
  },
  {
    name: "Activities",
    url: "/organization/activities",
    icon: Activity,
    description: "Learning Activities",
    color: "bg-red-500",
  },
]
