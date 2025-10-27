import { paymentsHttp } from "@/utils/http";

export const getLicenseKey = async (accountId: string): Promise<string> => {
    try {
        const response = await paymentsHttp.get<string>('/license-keys/by-account/' + accountId)
        return response.data
    }
    catch (error) {
        console.error("API Error in getLicenseKey:", error);
        throw error;    
    }
}