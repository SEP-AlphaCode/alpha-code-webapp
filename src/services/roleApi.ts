import http from '@/utils/http'

// Types cho Role
export interface Role {
  id: string
  name: string
}

// API functions cho roles
export const roleApi = {
  // Lấy danh sách roles
  getRoles: async (): Promise<Role[]> => {
    const response = await http.get('/api/v1/roles')
    return response.data
  },

  // Lấy role theo ID
  getRoleById: async (id: string): Promise<Role> => {
    const response = await http.get(`/api/v1/roles/${id}`)
    return response.data
  }
}
