import { configureStore } from '@reduxjs/toolkit'
import robotReducer from './robotSlice'

export const store = configureStore({
  reducer: {
    robot: robotReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch