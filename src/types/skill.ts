export type Skill = {
    code: string
    createdDate: string
    icon: string
    id: string
    lastUpdate: string
    name: string
    robotModelId: string
    status: number
    statusText: string
}

export type SkillResponse = {
    skills: Skill[]
    has_next: boolean
    has_previous: boolean
    page: number
    per_page: number
    total_pages: number
    total_items: number
}