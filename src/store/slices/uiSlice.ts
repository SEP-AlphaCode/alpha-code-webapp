import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view' | 'delete' | null
  data: any // Generic data for the modal
}

interface UIState {
  // Generic Modal system - có thể dùng cho nhiều module
  modals: {
    [modalName: string]: ModalState
  }
  
  // Loading states
  isLoading: boolean
  
  // Search and pagination (global)
  searchTerm: string
  currentPage: number
  pageSize: number
  
  // Sidebar state
  sidebarCollapsed: boolean
}

const initialState: UIState = {
  // Modal system
  modals: {},
  
  // Loading states
  isLoading: false,
  
  // Search and pagination
  searchTerm: '',
  currentPage: 1,
  pageSize: 10,
  
  // Sidebar state
  sidebarCollapsed: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Generic Modal actions - có thể dùng cho bất kỳ module nào
    openModal: (state, action: PayloadAction<{
      modalName: string
      mode: 'create' | 'edit' | 'view' | 'delete'
      data?: any
    }>) => {
      const { modalName, mode, data } = action.payload
      state.modals[modalName] = {
        isOpen: true,
        mode,
        data: data || null
      }
    },
    
    closeModal: (state, action: PayloadAction<string>) => {
      const modalName = action.payload
      if (state.modals[modalName]) {
        state.modals[modalName] = {
          isOpen: false,
          mode: null,
          data: null
        }
      }
    },
    
    // Helper actions cho các trường hợp thường gặp
    openCreateModal: (state, action: PayloadAction<string>) => {
      const modalName = action.payload
      state.modals[modalName] = {
        isOpen: true,
        mode: 'create',
        data: null
      }
    },
    
    openEditModal: (state, action: PayloadAction<{
      modalName: string
      data: any
    }>) => {
      const { modalName, data } = action.payload
      state.modals[modalName] = {
        isOpen: true,
        mode: 'edit',
        data
      }
    },
    
    openViewModal: (state, action: PayloadAction<{
      modalName: string
      data: any
    }>) => {
      const { modalName, data } = action.payload
      state.modals[modalName] = {
        isOpen: true,
        mode: 'view',
        data
      }
    },
    
    openDeleteModal: (state, action: PayloadAction<{
      modalName: string
      data: any
    }>) => {
      const { modalName, data } = action.payload
      state.modals[modalName] = {
        isOpen: true,
        mode: 'delete',
        data
      }
    },
    
    // Loading actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    // Search and pagination actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.currentPage = 1 // Reset to first page when searching
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1 // Reset to first page when changing page size
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const {
  // Generic Modal actions
  openModal,
  closeModal,
  
  // Helper modal actions
  openCreateModal,
  openEditModal,
  openViewModal,
  openDeleteModal,
  
  // Loading actions
  setLoading,
  
  // Search and pagination actions
  setSearchTerm,
  setCurrentPage,
  setPageSize,
  
  // Sidebar actions
  toggleSidebar,
  setSidebarCollapsed,
} = uiSlice.actions

export default uiSlice.reducer
