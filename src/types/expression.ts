export type Expression = {
    id: string
    code: string
    name: string
    imageUrl: string
    status: number
    createdDate: string
    lastUpdate: string
    robotModelId: string
    statusText: string
}

export type ExpressionModal = {
    code: string
    name: string
    imageUrl: string
    status: number
}