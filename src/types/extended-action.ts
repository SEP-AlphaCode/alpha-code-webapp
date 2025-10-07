export type RobotCommand = {
    id: string
    code: string
    icon: string
    name: string
    robotModelId: string
    status: number
    statusText: string
    createdDate: string
    lastUpdate: string
}

export type RobotCommandResponse = {
    RobotCommands: RobotCommand[]
    has_next: boolean
    has_previous: boolean
    page: number
    per_page: number
    total_count: number
    total_pages: number
}