import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getRobotsByAccountId } from '@/features/robots/api/robot-api'
import { Robot as ApiRobot } from '@/types/robot'
import { getUserIdFromToken } from '@/utils/tokenUtils'

export interface Robot {
  id: string
  serial: string
  name: string
  status: 'online' | 'offline' | 'busy'
  lastConnected?: string
  isSelected?: boolean
  battery?: number
  robotModelId?: string
  robotModelName?: string
  accountId?: string
}

interface RobotState {
  robots: Robot[]
  selectedRobotSerial: string | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  accountId: string | null
}

// Async thunk để fetch robots từ API
export const fetchRobotsByAccount = createAsyncThunk(
  'robots/fetchByAccount',
  async (accountId: string) => {
    const response = await getRobotsByAccountId(accountId);
    return response.data || [];
  }
);

// Async thunk để auto-fetch robots dựa trên token
export const fetchRobotsFromToken = createAsyncThunk(
  'robots/fetchFromToken',
  async () => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const accountId = getUserIdFromToken(accessToken);
        if (accountId) {
          const response = await getRobotsByAccountId(accountId);
          return { robots: response.data || [], accountId };
        }
      }
    }
    throw new Error('No valid token found');
  }
);

const initialState: RobotState = {
  robots: [],
  selectedRobotSerial: null,
  isConnected: false,
  isLoading: false,
  error: null,
  accountId: null
}

// Helper function để convert API robot sang Redux robot
const convertApiRobotToReduxRobot = (apiRobot: ApiRobot): Robot => ({
  id: apiRobot.id,
  serial: apiRobot.serialNumber,
  name: apiRobot.robotModelName || 'Unknown Robot',
  status: apiRobot.status === 1 ? 'online' : 'offline',
  lastConnected: apiRobot.lastUpdate || new Date().toISOString(),
  isSelected: false,
  battery: Math.floor(Math.random() * 100), // Tạm thời random vì API chưa có battery
  robotModelId: apiRobot.robotModelId,
  robotModelName: apiRobot.robotModelName,
  accountId: apiRobot.accountId
});

const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    addRobot: (state, action: PayloadAction<Robot>) => {
      const existingRobot = state.robots.find(robot => robot.serial === action.payload.serial)
      if (!existingRobot) {
        state.robots.push(action.payload)
      }
    },
    removeRobot: (state, action: PayloadAction<string>) => {
      state.robots = state.robots.filter(robot => robot.serial !== action.payload)
      if (state.selectedRobotSerial === action.payload) {
        state.selectedRobotSerial = state.robots.length > 0 ? state.robots[0].serial : null
      }
    },
    updateRobotStatus: (state, action: PayloadAction<{ serial: string; status: Robot['status'] }>) => {
      const robot = state.robots.find(robot => robot.serial === action.payload.serial)
      if (robot) {
        robot.status = action.payload.status
        robot.lastConnected = new Date().toISOString()
      }
    },
    selectRobot: (state, action: PayloadAction<string>) => {
      state.selectedRobotSerial = action.payload
      state.robots.forEach(robot => {
        robot.isSelected = robot.serial === action.payload
      })
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    updateRobotInfo: (state, action: PayloadAction<Partial<Robot> & { serial: string }>) => {
      const robot = state.robots.find(robot => robot.serial === action.payload.serial)
      if (robot) {
        Object.assign(robot, action.payload)
      }
    },
    updateRobotBattery: (state, action: PayloadAction<{ serial: string; battery: number }>) => {
      const robot = state.robots.find(robot => robot.serial === action.payload.serial)
      if (robot) {
        robot.battery = action.payload.battery
      }
    },
    clearAllRobots: (state) => {
      state.robots = []
      state.selectedRobotSerial = null
      state.isConnected = false
      state.accountId = null
    },
    resetError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchRobotsByAccount
      .addCase(fetchRobotsByAccount.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRobotsByAccount.fulfilled, (state, action) => {
        state.isLoading = false
        state.robots = action.payload.map(convertApiRobotToReduxRobot)
        // Auto-select first robot if none selected
        if (state.robots.length > 0 && !state.selectedRobotSerial) {
          state.selectedRobotSerial = state.robots[0].serial
          state.robots[0].isSelected = true
        }
      })
      .addCase(fetchRobotsByAccount.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch robots'
      })
      // fetchRobotsFromToken
      .addCase(fetchRobotsFromToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRobotsFromToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.robots = action.payload.robots.map(convertApiRobotToReduxRobot)
        state.accountId = action.payload.accountId
        // Auto-select first robot if none selected
        if (state.robots.length > 0 && !state.selectedRobotSerial) {
          state.selectedRobotSerial = state.robots[0].serial
          state.robots[0].isSelected = true
        }
      })
      .addCase(fetchRobotsFromToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch robots from token'
      })
  }
})

export const {
  addRobot,
  removeRobot,
  updateRobotStatus,
  selectRobot,
  setConnectionStatus,
  updateRobotInfo,
  updateRobotBattery,
  clearAllRobots,
  resetError
} = robotSlice.actions

export default robotSlice.reducer