export type Joystick = {
    accountId: string
    actionCode: string
    actionId: string
    actionName: string
    buttonCode: string
    createdDate: string
    danceCode: string
    danceId: string
    danceName: string
    expresstionCode: string
    expresstionId: string
    expresstionName: string
    extendedActionCode: string
    extendedActionId: string
    extendedActionName: string
    id: string
    lastUpdate: string
    robotId: string
    skillCode: string
    skillId: string
    skillName: string
    status: number
    type: string
}
export type JoystickResponse = {
    joysticks: Joystick[]
}