import { robotsHttp } from "@/utils/http"

export interface RobotModel {
  id: string
  name: string
  firmwareVersion: string
  ctrlVersion: string
  createdDate: string
  status: number
  statusText: string
}

export const getRobotModels = async (page = 1, size = 10) => {
  const res = await robotsHttp.get(`/robot-models`, { params: { page, size } })
  return res.data.data as RobotModel[]
}

export interface CreateRobotDto {
  accountId: string
  robotModelId: string
  serialNumber: string
  status: number
}

export const createRobot = async (data: CreateRobotDto) => {
  const res = await robotsHttp.post(`/robots`, data)
  return res.data
}
