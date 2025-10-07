export type RobotModel = {
    id: string
    name: string
    ctrlVersion: string
    firmwareVersion: string
    status: number
    createdDate: string
    lastUpdate: string
    statusText: string
}

export type RobotModelResponse = {
    robotModels: RobotModel[]
    total_count: number
    page: number
    per_page: number
    total_pages: number
    has_next: boolean
    has_previous: boolean
}