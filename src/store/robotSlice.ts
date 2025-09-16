import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RobotState {
  currentRobot: {
    id: string;
    name: string;
    status: string;
    avatar: string;
    battery: number;
  } | null;
}

const initialState: RobotState = {
  currentRobot: null,
};

const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    setCurrentRobot(state, action: PayloadAction<RobotState['currentRobot']>) {
      state.currentRobot = action.payload;
    },
    clearCurrentRobot(state) {
      state.currentRobot = null;
    },
  },
});

export const { setCurrentRobot, clearCurrentRobot } = robotSlice.actions;
export default robotSlice.reducer;
