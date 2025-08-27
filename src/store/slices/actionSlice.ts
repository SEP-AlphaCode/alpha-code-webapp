import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Action } from '@/types/action'

interface ActionState {
  // Data from API
  actions: Action[]
  totalCount: number
  
  // Current selected/active actions
  selectedActions: Action[]
  
  // Operation states
  isDeleting: boolean
  isCreating: boolean
  isUpdating: boolean
}

const initialState: ActionState = {
  // Data from API
  actions: [],
  totalCount: 0,
  
  selectedActions: [],
  
  // Operation states
  isDeleting: false,
  isCreating: false,
  isUpdating: false,
}

const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    // Data actions
    setActions: (state, action: PayloadAction<{ actions: Action[]; totalCount: number }>) => {
      state.actions = action.payload.actions
      state.totalCount = action.payload.totalCount
    },
    
    // Selection actions
    toggleActionSelection: (state, action: PayloadAction<Action>) => {
      const existingIndex = state.selectedActions.findIndex(a => a.id === action.payload.id)
      if (existingIndex >= 0) {
        state.selectedActions.splice(existingIndex, 1)
      } else {
        state.selectedActions.push(action.payload)
      }
    },
    
    selectAllActions: (state, action: PayloadAction<Action[]>) => {
      state.selectedActions = action.payload
    },
    
    clearAllSelections: (state) => {
      state.selectedActions = []
    },
    
    selectAction: (state, action: PayloadAction<Action>) => {
      state.selectedActions = [action.payload]
    },
    
    // Operation states
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
  },
})

export const {
  // Data actions
  setActions,
  
  // Selection actions
  toggleActionSelection,
  selectAllActions,
  clearAllSelections,
  selectAction,
  
  // Operation states
  setDeleting,
  setCreating,
  setUpdating,
} = actionSlice.actions

export default actionSlice.reducer
