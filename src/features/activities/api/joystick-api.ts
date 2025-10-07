import { Joystick, JoystickResponse } from "@/types/joystick";
import { activitiesHttp } from "@/utils/http";

// POST /api/v1/joysticks - Tạo mới joystick
export const createJoystick = async (joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate' | 'status'>) => {
  try {
    const response = await activitiesHttp.post('/joysticks', joystickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// GET /api/v1/joysticks/by-account-robot - Lấy joystick theo accountId và robotId (có cache Redis)
export const getJoystickByAccountRobot = async (accountId: string, robotId: string) => {
  try {
    const response = await activitiesHttp.get<JoystickResponse>('/joysticks/by-account-robot', {
      params: { accountId, robotId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE /api/v1/joysticks/{id} - Xóa mềm joystick (chỉ cập nhật trạng thái)
export const deleteJoystick = async (id: string) => {
  try {
    const response = await activitiesHttp.delete(`/joysticks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PATCH /api/v1/joysticks/{id} - Cập nhật một phần thông tin joystick (PATCH)
export const patchJoystick = async (id: string, joystickData: Partial<Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'>>) => {
  try {
    const response = await activitiesHttp.patch(`/joysticks/${id}`, joystickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT /api/v1/joysticks/{id} - Cập nhật toàn bộ thông tin joystick (PUT)
export const updateJoystick = async (id: string, joystickData: Omit<Joystick, 'id' | 'createdDate' | 'lastUpdate'>) => {
  try {
    const response = await activitiesHttp.put(`/joysticks/${id}`, joystickData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
