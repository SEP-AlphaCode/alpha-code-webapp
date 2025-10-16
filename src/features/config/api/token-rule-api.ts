import { TokenRule } from '@/types/pricing';
import { paymentsHttp } from '@/utils/http';

// Token Rule API - for managing token costs across different services (NLP, AI, etc.)
// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const getTokenRules = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ data: TokenRule[]; total_count: number; page: number; per_page: number; total_pages: number; has_next: boolean; has_previous: boolean }> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    const response = await paymentsHttp.get(`/token-rules?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token rules:', error);
    throw new Error('Failed to fetch token rules');
  }
};

export const getTokenRuleById = async (id: string): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.get(`/token-rules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token rule:', error);
    throw new Error('Failed to fetch token rule');
  }
};

export const createTokenRule = async (cost: number, code: string, note?: string): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.post('/token-rules', { cost, code, note });
    return response.data;
  } catch (error) {
    console.error('Error creating token rule:', error);
    throw new Error('Failed to create token rule');
  }
};

export const updateTokenRule = async (id: string, cost: number, code: string, note?: string): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.put(`/token-rules/${id}`, null, {
      params: { cost, code, note },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating token rule:', error);
    throw new Error('Failed to update token rule');
  }
};

export const deleteTokenRule = async (id: string): Promise<void> => {
  try {
    await paymentsHttp.delete(`/token-rules/${id}`);
  } catch (error) {
    console.error('Error deleting token rule:', error);
    throw new Error('Failed to delete token rule');
  }
};