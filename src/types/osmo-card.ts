export type OsmoCard = {
    id: string;
    color: string;
    name: string;
    status: number;
    lastUpdate: string;
    createdDate: string;
    expressionId: string;
    expressionName: string;
    actionId: string;
    actionName: string;
    danceId: string;
    danceName: string;
    statusText: string;
};

// Types for query parameters
export interface OsmoCardsQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    color?: string;
}
