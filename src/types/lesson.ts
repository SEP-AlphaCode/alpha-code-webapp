export type Lesson = {
    id: string
    sectionId: string
    content: string
    duration: number
    orderNumber: number
    title: string
    type: number
    typeText: string
    status: number
    statusText: string
    requireRobot: boolean
    solution: string
    createdDate: string
    lastUpdated?: string
}