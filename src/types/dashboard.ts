export type DashboardStats = {
    total: number;
    role: string;
    growthRate: number;
    newThisMonth: number;
};

export type DashboardSummary = {
    totalOrganizations: number;
    totalAccounts: number;
    totalRobots: number;
    totalActivities: number;
}

export type DashboardUserStats = {
    newUsersLastMonth: number;
    newUsersThisMonth: number;
    growthRate: number;
    totalAccounts: number;
}