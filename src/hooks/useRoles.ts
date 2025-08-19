import { useQuery } from '@tanstack/react-query'
import { roleApi } from '@/services/roleApi'

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
}

// Hook để lấy danh sách roles
export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: roleApi.getRoles,
    staleTime: 10 * 60 * 1000, // 10 phút
    retry: 2
  })
}

// Hook để lấy role theo ID
export const useRole = (id: string, enabled = true) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
    retry: 2
  })
}
