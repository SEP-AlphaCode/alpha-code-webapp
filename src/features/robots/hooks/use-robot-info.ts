import { getRobotInfo } from "@/features/robots/api/robot_info_api";
import { useQuery } from "@tanstack/react-query";
import { RobotInfoResponse } from "@/types/robot-info";

export const useRobotInfo = () => {
    
    /**
     * Hook để lấy thông tin robot theo serial number
     * @param serial - Robot serial number
     * @param timeout - Timeout in seconds (default: 10)
     * @param options - Additional query options
     */
    const useGetRobotInfo = (serial: string, timeout: number = 10, options: { enabled?: boolean } = {}) => {
        return useQuery<RobotInfoResponse>({
            queryKey: ["robot-info", serial, timeout],
            queryFn: () => getRobotInfo(serial, timeout),
            enabled: options.enabled !== false && !!serial, // Chỉ chạy khi có serial và enabled
            retry: 2,
            retryDelay: 1000,
            staleTime: 1000 * 60 * 2, // Cache 2 phút
        });
    };

    return {
        useGetRobotInfo,
    };
};
