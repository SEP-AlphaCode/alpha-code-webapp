import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getRobotsByAccountId } from '@/features/robots/api/robot-api'
import { Robot as ApiRobot } from '@/types/robot'
import { getUserIdFromToken } from '@/utils/tokenUtils'

// --------------------
// 🔧 Type definitions
// --------------------
export type ConnectMode = 'single' | 'multi'

export interface Robot {
  id: string
  serial: string
  name: string
  status: 'online' | 'offline' | 'busy' | 'charging' 
  lastConnected?: string
  isSelected?: boolean
  battery?: string | null // Giữ nguyên string/null
  robotModelId?: string
  robotModelName?: string
  accountId?: string
  ctrlVersion?: string | null
  firmwareVersion?: string | null
}

interface RobotState {
  robots: Robot[]
  selectedRobotSerial: string | string[] | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  accountId: string | null
  connectMode: ConnectMode
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
          const robots = response.data || []
          return { robots, accountId }
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
  connectMode: 'single',
}

// --------------------
// 🔄 Helper converter
// --------------------
const convertApiRobotToReduxRobot = (apiRobot: any): Robot => ({
  id: apiRobot.id,
  serial: apiRobot.serialNumber || apiRobot.serial_number, // 👈 fix
  name: apiRobot.robotModelName || apiRobot.robot_model_name || 'Unknown Robot',
  status:
    apiRobot.status === 'online' || apiRobot.status === 'success'
      ? 'online'
      : apiRobot.status === 'busy'
      ? 'busy'
      : 'offline',
  lastConnected: apiRobot.lastUpdate || apiRobot.last_update || new Date().toISOString(),
  isSelected: false,
  battery:
    apiRobot.battery?.toString() ??
    apiRobot.battery_level?.toString() ??
    null, // 👈 handle number or string
  robotModelId: apiRobot.robotModelId || apiRobot.robot_model_id,
  robotModelName: apiRobot.robotModelName || apiRobot.robot_model_name,
  accountId: apiRobot.accountId,
  ctrlVersion: apiRobot.ctrlVersion || apiRobot.ctrl_version || null, // 👈 fix
  firmwareVersion: apiRobot.firmwareVersion || apiRobot.firmware_version || null, // 👈 fix
})


// --------------------
// 🧠 Slice
// --------------------
const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    addRobot: (state, action: PayloadAction<Robot>) => {
      const existing = state.robots.find(r => r.serial === action.payload.serial)
      if (!existing) state.robots.push(action.payload)
    },

    removeRobot: (state, action: PayloadAction<string>) => {
      state.robots = state.robots.filter(r => r.serial !== action.payload)
      if (state.selectedRobotSerial === action.payload) {
        state.selectedRobotSerial =
          state.robots.length > 0 ? state.robots[0].serial : null
      }
    },

    updateRobotStatus: (
      state,
      action: PayloadAction<{ serial: string; status: Robot['status'] }>
    ) => {
      const robot = state.robots.find(r => r.serial === action.payload.serial)
      if (robot) {
        robot.status = action.payload.status
        robot.lastConnected = new Date().toISOString()
      }
    },

    selectRobot: (state, action: PayloadAction<string>) => {
      if (state.connectMode === 'multi') {
        const current = Array.isArray(state.selectedRobotSerial)
          ? state.selectedRobotSerial
          : state.selectedRobotSerial
          ? [state.selectedRobotSerial]
          : []

        if (current.includes(action.payload)) {
          state.selectedRobotSerial = current.filter(s => s !== action.payload)
        } else {
          state.selectedRobotSerial = [...current, action.payload]
        }

        state.robots.forEach(robot => {
          robot.isSelected = (state.selectedRobotSerial as string[]).includes(robot.serial)
        })
      } else {
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

    updateRobotBattery: (
      state,
      action: PayloadAction<{ serial: string; battery: string | null }> // ✅ ĐIỀU CHỈNH: Cho phép nhận string HOẶC number
    ) => {
      const robot = state.robots.find(r => r.serial === action.payload.serial)
      if (robot) {
          robot.battery = String(action.payload.battery) // ✅ GÁN STRING VÀO STORE
      }
    },

    clearAllRobots: state => {
      state.robots = []
      state.selectedRobotSerial = null
      state.isConnected = false
      state.accountId = null
    },

    resetError: state => {
      state.error = null
    },

    // ✅ Chuyển mode single/multi
    setConnectMode: (state, action: PayloadAction<ConnectMode>) => {
      const newMode = action.payload
      state.connectMode = newMode

      if (newMode === 'single' && Array.isArray(state.selectedRobotSerial)) {
        state.selectedRobotSerial = state.selectedRobotSerial[0] ?? null
      }

      state.robots.forEach(robot => {
        robot.isSelected = Array.isArray(state.selectedRobotSerial)
          ? state.selectedRobotSerial.includes(robot.serial)
          : robot.serial === state.selectedRobotSerial
      })
    },
  },

  // --------------------
  // 🔁 Extra reducers
  // --------------------
  extraReducers: builder => {
    builder
      .addCase(fetchRobotsByAccount.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRobotsByAccount.fulfilled, (state, action) => {
        state.isLoading = false
        const robots = action.payload.map(convertApiRobotToReduxRobot)
        if (robots.length > 0) {
          state.robots = robots
          if (!state.selectedRobotSerial) {
            state.selectedRobotSerial = robots[0].serial
            robots[0].isSelected = true
          }
        }
      })
      .addCase(fetchRobotsByAccount.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch robots'
      })
      .addCase(fetchRobotsFromToken.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRobotsFromToken.fulfilled, (state, action) => {
        state.isLoading = false
        const robots = action.payload.robots.map(convertApiRobotToReduxRobot)
        state.accountId = action.payload.accountId
        if (robots.length > 0) {
          state.robots = robots
          if (!state.selectedRobotSerial) {
            state.selectedRobotSerial = robots[0].serial
            robots[0].isSelected = true
          }
        }
      })
      .addCase(fetchRobotsFromToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch robots from token'
      })
  },
})

// --------------------
// 🧩 Export
// --------------------
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
  setConnectMode,
} = robotSlice.actions

export default robotSlice.reducer