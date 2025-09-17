export interface TeacherClassDto {
  classId: string
  className: string
  createdDate: string
  lastUpdate: string
  status: number
  statusText: string
  teacherId: string
  teacherName: string
}

export interface Robot {
  name: string;
  status: "online" | "offline";
  avatar: string;
  id: string;
  battery: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}