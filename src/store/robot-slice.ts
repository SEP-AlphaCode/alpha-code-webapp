import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getRobotsByAccountId } from '@/features/robots/api/robot-api'
import { Robot as ApiRobot } from '@/types/robot'
import { getUserIdFromToken } from '@/utils/tokenUtils'

// --------------------
// 🔧 Type definitions
// --------------------

export type ConnectMode = "single" | "multi"

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
  ctrl_version?: string
  firmware_version?: string
}

interface RobotState {
  robots: Robot[]
  selectedRobotSerial: string | string[] | null // ✅ cho phép multi
  isConnected: boolean
  isLoading: boolean
  error: string | null
  accountId: string | null
  connectMode: ConnectMode              // ✅ thêm connectMode state
}

// --------------------
// ⚙️ Async actions
// --------------------

export const fetchRobotsByAccount = createAsyncThunk(
  'robots/fetchByAccount',
  async (accountId: string) => {
    const response = await getRobotsByAccountId(accountId)
    return response.data || []
  }
)

export const fetchRobotsFromToken = createAsyncThunk(
  'robots/fetchFromToken',
  async (_, { getState }) => {
    const state = getState() as { robot: RobotState }

    if (state.robot.isLoading) {
      throw new Error('Request already in progress')
    }

    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken')
      if (accessToken) {
        const accountId = getUserIdFromToken(accessToken)
        if (accountId) {
          const response = await getRobotsByAccountId(accountId)
          return { robots: response.data || [], accountId }
        }
      }
    }
    throw new Error('No valid token found')
  }
)

// --------------------
// 🧩 Initial state
// --------------------
const initialState: RobotState = {
  robots: [],
  selectedRobotSerial: null,
  isConnected: false,
  isLoading: false,
  error: null,
  accountId: null,
  connectMode: "single" // ✅ mặc định single mode
}

// --------------------
// 🔄 Helper convert
// --------------------
const convertApiRobotToReduxRobot = (apiRobot: ApiRobot): Robot => ({
  id: apiRobot.id,
  serial: apiRobot.serialNumber,
  name: apiRobot.robotModelName || 'Unknown Robot',
  status:
    apiRobot.status === 'online' || apiRobot.status === 'success'
      ? 'online'
      : apiRobot.status === 'busy'
      ? 'busy'
      : 'offline',
  lastConnected: apiRobot.lastUpdate || new Date().toISOString(),
  isSelected: false,
  battery: apiRobot.battery_level ?? 0,
  robotModelId: apiRobot.robotModelId,
  robotModelName: apiRobot.robotModelName,
  accountId: apiRobot.accountId
})

// --------------------
// 🧠 Slice
// --------------------
const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    addRobot: (state, action: PayloadAction<Robot>) => {
      const existingRobot = state.robots.find(r => r.serial === action.payload.serial)
      if (!existingRobot) state.robots.push(action.payload)
    },
    removeRobot: (state, action: PayloadAction<string>) => {
      state.robots = state.robots.filter(r => r.serial !== action.payload)
      if (state.selectedRobotSerial === action.payload) {
        state.selectedRobotSerial = state.robots.length > 0 ? state.robots[0].serial : null
      }
    },
    updateRobotStatus: (state, action: PayloadAction<{ serial: string; status: Robot['status'] }>) => {
      const robot = state.robots.find(r => r.serial === action.payload.serial)
      if (robot) {
        robot.status = action.payload.status
        robot.lastConnected = new Date().toISOString()
      }
    },

    // ✅ Nâng cấp selectRobot để hỗ trợ cả single/multi mode
    selectRobot: (state, action: PayloadAction<string>) => {
      if (state.connectMode === "multi") {
        const current = Array.isArray(state.selectedRobotSerial)
          ? state.selectedRobotSerial
          : state.selectedRobotSerial
          ? [state.selectedRobotSerial]
          : []

        // toggle logic
        if (current.includes(action.payload)) {
          state.selectedRobotSerial = current.filter(s => s !== action.payload)
        } else {
          state.selectedRobotSerial = [...current, action.payload]
        }

        // update selection flag
        state.robots.forEach(robot => {
          robot.isSelected = (state.selectedRobotSerial as string[]).includes(robot.serial)
        })
      } else {
        // single mode
        state.selectedRobotSerial = action.payload
        state.robots.forEach(robot => {
          robot.isSelected = robot.serial === action.payload
        })
      }
    },

    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },

    updateRobotInfo: (state, action: PayloadAction<Partial<Robot> & { serial: string }>) => {
      const robot = state.robots.find(r => r.serial === action.payload.serial)
      if (robot) Object.assign(robot, action.payload)
    },

    updateRobotBattery: (state, action: PayloadAction<{ serial: string; battery: number }>) => {
      const robot = state.robots.find(r => r.serial === action.payload.serial)
      if (robot) robot.battery = action.payload.battery
    },

    clearAllRobots: (state) => {
      state.robots = []
      state.selectedRobotSerial = null
      state.isConnected = false
      state.accountId = null
    },

    resetError: (state) => {
      state.error = null
    },

    // ✅ Thêm reducer setConnectMode
    setConnectMode: (state, action: PayloadAction<ConnectMode>) => {
      state.connectMode = action.payload
      // Khi chuyển từ multi về single → chỉ giữ robot đầu tiên
      if (action.payload === "single" && Array.isArray(state.selectedRobotSerial)) {
        state.selectedRobotSerial = state.selectedRobotSerial[0] ?? null
      }
      // Reset flag isSelected
      state.robots.forEach(robot => {
        robot.isSelected = Array.isArray(state.selectedRobotSerial)
          ? state.selectedRobotSerial.includes(robot.serial)
          : robot.serial === state.selectedRobotSerial
      })
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRobotsByAccount.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRobotsByAccount.fulfilled, (state, action) => {
        state.isLoading = false
        state.robots = action.payload.map(convertApiRobotToReduxRobot)
        if (state.robots.length > 0 && !state.selectedRobotSerial) {
          state.selectedRobotSerial = state.robots[0].serial
          state.robots[0].isSelected = true
        }
      })
      .addCase(fetchRobotsByAccount.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch robots'
      })
      .addCase(fetchRobotsFromToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRobotsFromToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.robots = action.payload.robots.map(convertApiRobotToReduxRobot)
        state.accountId = action.payload.accountId
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
  resetError,
  setConnectMode // ✅ export action mới
} = robotSlice.actions

export default robotSlice.reducer
