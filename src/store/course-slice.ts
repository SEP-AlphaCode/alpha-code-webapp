import { Category } from "@/types/courses";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  pagination: {
    page: number;
    size: number;
  };
  filters: {
    categoryIds: string[];
  };
  currentCourse: {
    name: string | null;
    slug: string | null;
  };
}

const initialState: CourseState = {
  pagination: {
    page: 1,
    size: 12,
  },
  filters: {
    categoryIds: []
  },
  currentCourse: {
    name: null,
    slug: null
  }
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.categoryIds = action.payload;
      state.pagination.page = 1;
    },
    setCurrentCourse: (state, action: PayloadAction<{ name: string; slug: string } | null>) => {
      if (action.payload) {
        state.currentCourse = {
          name: action.payload.name,
          slug: action.payload.slug
        };
      } else {
        state.currentCourse = {
          name: null,
          slug: null
        };
      }
    },
  }
});

export const { setPage, setCategoryFilter, setCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;