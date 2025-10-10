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
  resetError,
  fetchRobotsByAccount,
  fetchRobotsFromToken,
  Robot 
} from '@/store/robotSlice'

export const useRobotStore = () => {
  const dispatch = useAppDispatch()
  const { robots, selectedRobotSerial, isConnected, isLoading, error, accountId } = useAppSelector(state => state.robot)
  
  const selectedRobot = robots.find(robot => robot.serial === selectedRobotSerial)

  return {
    // State
    robots,
    selectedRobotSerial,
    selectedRobot,
    isConnected,
    isLoading,
    error,
    accountId,
    
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
    resetError: () => dispatch(resetError()),
    
    // Async Actions
    fetchRobotsByAccount: (accountId: string) => dispatch(fetchRobotsByAccount(accountId)),
    fetchRobotsFromToken: () => dispatch(fetchRobotsFromToken()),
    
    // Legacy compatibility
    initializeMockData: () => dispatch(fetchRobotsFromToken())
  }
}