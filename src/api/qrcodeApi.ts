import http from '../utils/http';
import {QRCodeRequest, QRCodeResponse} from '@/types/qrcode';

export const createQRCode = async (data: QRCodeRequest): Promise<QRCodeResponse> => {
  const response = await http.post('/qrcode', data);
  return response.data;
};

export const getQRCodeById = async (id: string): Promise<QRCodeResponse> => {
  const response = await http.get(`/qrcode/${id}`);
  return response.data;
};

export const updateQRCode = async (id: string, data: Partial<QRCodeRequest>): Promise<QRCodeResponse> => {
  const response = await http.put(`/qrcode/${id}`, data);
  return response.data;
};

export const deleteQRCode = async (id: string): Promise<void> => {
  await http.delete(`/qrcode/${id}`);
};

export const getAllQRCodes = async (): Promise<QRCodeResponse[]> => {
  const response = await http.get('/qrcode');
  return response.data;
};

export const updateQRCodeStatus = async (id: string, status: string): Promise<QRCodeResponse> => {
  const response = await http.patch(`/qrcode/${id}/status`, { status });
  return response.data;
};
