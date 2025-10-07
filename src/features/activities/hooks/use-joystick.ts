import { 
  createJoystick,
  getJoystickByAccountRobot,
  deleteJoystick,
  patchJoystick,
  updateJoystick
} from "@/features/activities/api/joystick-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Joystick, JoystickResponse } from "@/types/joystick";

export const useJoystick = () => {
    const queryClient = useQueryClient();

    // Get joystick by account and robot (with Redis cache)
    const useGetJoystickByAccountRobot = (accountId: string, robotId: string) => {
        return useQuery<JoystickResponse>({
            queryKey: ["joysticks", "by-account-robot", accountId, robotId],
            queryFn: () => getJoystickByAccountRobot(accountId, robotId),
            enabled: !!accountId && !!robotId,
            staleTime: 1000 * 60 * 5, // 5 minutes cache
        });
    };

    // Create joystick mutation
    const useCreateJoystick = () => {
        return useMutation({
            mutationFn: createJoystick,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
            },
        });
    };

    // Update joystick mutation (PUT - full update)
    const useUpdateJoystick = () => {
        return useMutation({
            mutationFn: ({ id, joystickData }: { 
                id: string; 
                joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'> 
            }) => updateJoystick(id, joystickData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
            },
        });
    };

    // Patch joystick mutation (PATCH - partial update)
    const usePatchJoystick = () => {
        return useMutation({
            mutationFn: ({ id, joystickData }: { 
                id: string; 
                joystickData: Partial<Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'>> 
            }) => patchJoystick(id, joystickData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
            },
        });
    };

    // Delete joystick mutation (soft delete)
    const useDeleteJoystick = () => {
        return useMutation({
            mutationFn: deleteJoystick,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["joysticks"] });
            },
        });
    };

    return {
        useGetJoystickByAccountRobot,
        useCreateJoystick,
        useUpdateJoystick,
        usePatchJoystick,
        useDeleteJoystick,
    };
};
