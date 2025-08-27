export type Action = {
    id: string
    name: string
    description: string
    duration: number
    status: number
    createdDate: string
    lastUpdate: string
    canInterrupt: boolean
}

export type ActionModal = {
    name: string
    description: string
    duration: number
    status: number
    canInterrupt: boolean
}