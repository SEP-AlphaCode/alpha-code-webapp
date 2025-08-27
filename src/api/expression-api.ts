import { Expression, ExpressionModal } from "@/types/expression";
import { PagedResult } from "@/types/page-result";
import http from "@/utils/http";

export const getPagedExpressions = async (page: number, size: number, search?: string, signal?: AbortSignal) => {
  try {
    const response = await http.get<PagedResult<Expression>>('/expressions', {
      params: {
        page,
        size,
        search
      },
      signal // Add AbortSignal support
    });
    // Handle different response structures
    return response.data;

  } catch (error) {
    console.error("API Error in getPagedExpressions:", error);
    throw error;
  }
};

export const createExpression = async (expressionData: ExpressionModal) => {
  const response = await http.post('/expressions', expressionData);
  return response.data;
};

export const updateExpression = async (id: string, expressionData: ExpressionModal) => {
  const response = await http.put(`/expressions/${id}`, expressionData);
  return response.data;
};

export const deleteExpression = async (id: string) => {
  const response = await http.delete(`/expressions/${id}`);
  return response.data;
};
