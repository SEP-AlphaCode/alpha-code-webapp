export type Action = {
    id: string
    name: string
    description: string
    duration: number
    status: number
    createDate: string
    lastUpdate: string
    canInterrupt: boolean
}

export type CreateAction = {
    name: string
    description: string
    duration: number
    status: number
    canInterrupt: boolean
}