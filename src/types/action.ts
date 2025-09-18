export type Action = {
    id: string
    code: string
    name: string
    description: string
    duration: number
    status: number
    icon: string
    createdDate: string
    lastUpdate: string
    canInterrupt: boolean
}

export type ActionModal = {
    name: string
    code: string
    description: string
    duration: number
    status: number
    canInterrupt: boolean
    icon: string
}