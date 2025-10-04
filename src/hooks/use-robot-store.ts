import { useAppDispatch, useAppSelector } from './use-redux-hooks'
import { 
  addRobot, 
  removeRobot, 
  updateRobotStatus, 
  selectRobot, 
  setConnectionStatus,
  updateRobotInfo,
  updateRobotBattery,
  clearAllRobots,
  initializeMockData,
  Robot 
} from '@/store/robotSlice'

export const useRobotStore = () => {
  const dispatch = useAppDispatch()
  const { robots, selectedRobotSerial, isConnected } = useAppSelector(state => state.robot)
  
  const selectedRobot = robots.find(robot => robot.serial === selectedRobotSerial)

  return {
    // State
    robots,
    selectedRobotSerial,
    selectedRobot,
    isConnected,
    
    // Actions
    addRobot: (robot: Robot) => dispatch(addRobot(robot)),
    removeRobot: (serial: string) => dispatch(removeRobot(serial)),
    updateRobotStatus: (serial: string, status: Robot['status']) => 
      dispatch(updateRobotStatus({ serial, status })),
    selectRobot: (serial: string) => dispatch(selectRobot(serial)),
    setConnectionStatus: (connected: boolean) => dispatch(setConnectionStatus(connected)),
    updateRobotInfo: (info: Partial<Robot> & { serial: string }) => 
      dispatch(updateRobotInfo(info)),
    updateRobotBattery: (serial: string, battery: number) =>
      dispatch(updateRobotBattery({ serial, battery })),
    clearAllRobots: () => dispatch(clearAllRobots()),
    initializeMockData: () => dispatch(initializeMockData())
  }
}