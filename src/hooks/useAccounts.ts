import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accountApi, Account, UpdateAccountRequest } from '@/services/accountApi'
import { toast } from 'react-toastify'

// Types cho error handling
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

// Types cho query parameters
interface AccountsQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

// Helper functions để convert giữa API format và display format
export const convertAccountForDisplay = (account: Account) => ({
  ...account,
  // Convert status number to string
  statusText: account.status === 1 ? 'active' : account.status === 0 ? 'inactive' : account.status === 2 ? 'pending' : 'banned',
  // Convert gender number to string  
  genderText: account.gender === 0 ? 'female' : account.gender === 1 ? 'male' : 'other',
  // Format role
  role: account.roleName as 'teacher' | 'admin' | 'student'
});

// Query keys
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (params?: AccountsQueryParams) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  fullName: () => [...accountKeys.all, 'fullName'] as const,
}

// Hook để lấy danh sách accounts
export const useAccounts = (params?: AccountsQueryParams) => {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountApi.getAccounts(params),
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 2
  })
}

// Hook để lấy account theo ID
export const useAccount = (id: string, enabled = true) => {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountApi.getAccountById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
}

// Hook để lấy full name
export const useAccountFullName = () => {
  return useQuery({
    queryKey: accountKeys.fullName(),
    queryFn: accountApi.getAccountFullName,
    staleTime: 10 * 60 * 1000, // 10 phút
    retry: 2
  })
}

// Hook để tạo account mới
export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountApi.createAccount,
    onSuccess: (newAccount) => {
      // Invalidate và refetch accounts list
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      
      // Thêm account mới vào cache (optimistic update)
      queryClient.setQueryData(accountKeys.detail(newAccount.id), newAccount)
      
      toast.success('Tạo tài khoản thành công!')
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản'
      toast.error(message)
    }
  })
}

// Hook để cập nhật account
export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountApi.updateAccount(id, data),
    onSuccess: (updatedAccount, { id }) => {
      // Cập nhật cache cho account detail
      queryClient.setQueryData(accountKeys.detail(id), updatedAccount)
      
      // Invalidate accounts list để refresh
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      
      toast.success('Cập nhật tài khoản thành công!')
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản'
      toast.error(message)
    }
  })
}

// Hook để xóa account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: accountApi.deleteAccount,
    onSuccess: (_, deletedId) => {
      // Xóa account khỏi cache
      queryClient.removeQueries({ queryKey: accountKeys.detail(deletedId) })
      
      // Invalidate accounts list
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      
      toast.success('Xóa tài khoản thành công!')
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa tài khoản'
      toast.error(message)
    }
  })
}
