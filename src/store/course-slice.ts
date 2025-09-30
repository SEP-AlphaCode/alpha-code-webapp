import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CourseState {
  pagination: {
    page: number;
    size: number;
  };
  filters: {
    categoryId: string | null;
  };
}

const initialState: CourseState = {
  pagination: {
    page: 1,
    size: 12,
  },
  filters: {
    categoryId: null
  }
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.categoryId = action.payload;
      state.pagination.page = 1;
    },
  }
});

export const { setPage, setCategoryFilter } = courseSlice.actions;
export default courseSlice.reducer;