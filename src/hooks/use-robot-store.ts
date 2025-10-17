import { useCallback } from 'react'
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
} from '@/store/robot-slice'

export const useRobotStore = () => {
  const dispatch = useAppDispatch()
  const { robots, selectedRobotSerial, isConnected, isLoading, error, accountId } = useAppSelector(state => state.robot)
  
  const selectedRobot = robots.find(robot => robot.serial === selectedRobotSerial)

  // Memoize the initializeMockData function to prevent unnecessary re-renders
  const initializeMockData = useCallback(() => {
    // Only fetch if we don't already have robots and we're not currently loading
    if (robots.length === 0 && !isLoading) {
      dispatch(fetchRobotsFromToken())
    }
  }, [dispatch, robots.length, isLoading])

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
    addRobot: useCallback((robot: Robot) => dispatch(addRobot(robot)), [dispatch]),
    removeRobot: useCallback((serial: string) => dispatch(removeRobot(serial)), [dispatch]),
    updateRobotStatus: useCallback((serial: string, status: Robot['status']) => 
      dispatch(updateRobotStatus({ serial, status })), [dispatch]),
    selectRobot: useCallback((serial: string) => dispatch(selectRobot(serial)), [dispatch]),
    setConnectionStatus: useCallback((connected: boolean) => dispatch(setConnectionStatus(connected)), [dispatch]),
    updateRobotInfo: useCallback((info: Partial<Robot> & { serial: string }) => 
      dispatch(updateRobotInfo(info)), [dispatch]),
    updateRobotBattery: useCallback((serial: string, battery: number) =>
      dispatch(updateRobotBattery({ serial, battery })), [dispatch]),
    clearAllRobots: useCallback(() => dispatch(clearAllRobots()), [dispatch]),
    resetError: useCallback(() => dispatch(resetError()), [dispatch]),
    
    // Async Actions
    fetchRobotsByAccount: useCallback((accountId: string) => dispatch(fetchRobotsByAccount(accountId)), [dispatch]),
    fetchRobotsFromToken: useCallback(() => dispatch(fetchRobotsFromToken()), [dispatch]),
    
    // Legacy compatibility - now properly memoized
    initializeMockData
  }
}