import { TeacherClassDto } from "./teacher"

export interface ClassDto {
  id: string
  name: string
  createdDate: string
  lastUpdate: string
  status: number
  statusText: string
  teachers: TeacherClassDto[]
}

export enum ClassStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

export const getStatusText = (status: number): string => {
  switch (status) {
    case ClassStatus.ACTIVE:
      return "Active"
    case ClassStatus.INACTIVE:
      return "Inactive"
    default:
      return "Unknown"
  }
}

export const getStatusColor = (status: number): string => {
  switch (status) {
    case ClassStatus.ACTIVE:
      return "bg-green-100 text-green-800"
    case ClassStatus.INACTIVE:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}