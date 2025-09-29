import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Robot {
  id: string
  serial: string
  name: string
  status: 'online' | 'offline' | 'busy'
  lastConnected?: string
  isSelected?: boolean
  battery?: number
}

interface RobotState {
  robots: Robot[]
  selectedRobotSerial: string | null
  isConnected: boolean
}

// Mock data cho robots (từ header)
const mockRobots: Robot[] = [
  {
    id: '1',
    serial: 'EAA007UBT10000341',
    name: 'Alpha Mini #1',
    status: 'online',
    lastConnected: new Date().toISOString(),
    isSelected: true,
    battery: 85
  },
  {
    id: '2', 
    serial: 'EAA007UBT10000342',
    name: 'Alpha Mini #2',
    status: 'offline',
    lastConnected: new Date(Date.now() - 3600000).toISOString(),
    isSelected: false,
    battery: 45
  },
  {
    id: '3',
    serial: 'EAA007UBT10000343', 
    name: 'Alpha Mini #3',
    status: 'busy',
    lastConnected: new Date(Date.now() - 1800000).toISOString(),
    isSelected: false,
    battery: 12
  }
]

const initialState: RobotState = {
  robots: mockRobots,
  selectedRobotSerial: 'EAA007UBT10000341', // Default selected robot
  isConnected: false
}

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
        // Select first available robot if current one is removed
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
      // Update selected status for all robots
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
    },
    initializeMockData: (state) => {
      if (state.robots.length === 0) {
        state.robots = mockRobots
        state.selectedRobotSerial = 'EAA007UBT10000341'
      }
    }
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
  initializeMockData
} = robotSlice.actions

export default robotSlice.reducer