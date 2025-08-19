import http from '@/utils/http'

// Types cho Account
export interface Account {
  id: string
  username: string
  password?: string // Không nên trả về trong response
  fullName: string
  phone: string
  email: string
  gender: number // 0: female, 1: male, 2: other
  createdDate: string
  lastEdited: string | null
  status: number // 0: inactive, 1: active, 2: pending, 3: banned
  image: string | null
  bannedReason: string | null
  roleId: string
  roleName: string // 'teacher' | 'admin' | 'student'
}

export interface CreateAccountRequest {
  username: string
  password: string
  fullName: string
  phone: string
  email: string
  gender: number
  roleId: string
}

export interface UpdateAccountRequest {
  username?: string
  fullName?: string
  phone?: string
  email?: string
  gender?: number
  status?: number
  image?: string
  bannedReason?: string
  roleId?: string
}

export interface AccountsResponse {
  data: Account[]
  total: number
  page: number
  limit: number
}

// API functions
export const accountApi = {
  // Lấy danh sách accounts
  getAccounts: async (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }): Promise<AccountsResponse> => {
    const response = await http.get('/api/v1/accounts', { params })
    return response.data
  },

  // Lấy account theo ID
  getAccountById: async (id: string): Promise<Account> => {
    const response = await http.get(`/api/v1/accounts/${id}`)
    return response.data
  },

  // Lấy full name của user hiện tại
  getAccountFullName: async (): Promise<{ fullName: string }> => {
    const response = await http.get('/api/v1/accounts/full-name')
    return response.data
  },

  // Tạo account mới
  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await http.post('/api/v1/accounts', data)
    return response.data
  },

  // Cập nhật account
  updateAccount: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const response = await http.put(`/api/v1/accounts/${id}`, data)
    return response.data
  },

  // Xóa account
  deleteAccount: async (id: string): Promise<void> => {
    await http.delete(`/api/v1/accounts/${id}`)
  }
}
