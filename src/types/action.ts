import { Color } from "./color"

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
    robotModelId: string
    statusText?: string
}

export type ActionModal = {
    robotModelId?: string
    name: string
    code: string
    description: string
    duration: number
    status: number
    canInterrupt: boolean
    icon: string
}

export type ActionActivites = {
    action_id: string;
    start_time: number;
    duration: number;
    action_type: string;
    color: Color[];
}

