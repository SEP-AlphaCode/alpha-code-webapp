import { configureStore } from '@reduxjs/toolkit'
import robotReducer from './robotSlice'
import courseReducer from './course-slice'
import teacherCourseReducer from './teacher-course-slice'

export const store = configureStore({
  reducer: {
    robot: robotReducer,
    course: courseReducer,
    teacherCourse: teacherCourseReducer
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