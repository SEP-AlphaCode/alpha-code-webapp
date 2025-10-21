import { Action, ActionModal } from "@/types/action";
import { PagedResult } from "@/types/page-result";
import { paymentsHttp } from "@/utils/http";

export const getPagedSubscriptions = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal,
) => {
  try {
    const response = await paymentsHttp.get<PagedResult<Action>>("/subscription-plans", {
      params: {
        page,
        size,
        search,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("API Error in getPagedSubscriptionPlan:", error);
    throw error;
  }
};

export const createSubscription = async (actionData: ActionModal) => {
  const response = await paymentsHttp.post('/subscription-plans', actionData);
  return response.data;
};

export const updateSubscription = async (id: string, actionData: ActionModal) => {
  const response = await paymentsHttp.put(`/subscription-plans/${id}`, actionData);
  return response.data;
};

export const deleteSubscription = async (id: string) => {
  const response = await paymentsHttp.delete(`/subscription-plans/${id}`);
  return response.data;
};