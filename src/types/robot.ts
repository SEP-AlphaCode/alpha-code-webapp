export type Robot = {
  id: string
  serialNumber: string
  robotModelId: string
  robotModelName: string
  accountId: string
  status: number
  statusText: string
  createdDate: string
  lastUpdate: string
}

export type RobotResponse = {
  robots: Robot[]
  total_count: number
  page: number
  per_page: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}