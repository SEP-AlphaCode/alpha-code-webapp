import http from '../utils/http';
import {QRCodeRequest, QRCodeResponse} from '@/types/qrcode';

export const createQRCode = async (data: QRCodeRequest): Promise<QRCodeResponse> => {
  const response = await http.post('/qrcode', data);
  return response.data;
};

export const getQRCodeById = async (id: string): Promise<QRCodeResponse> => {
  const response = await http.get(`/qr-codes/${id}`);
  return response.data;
};

export const updateQRCode = async (id: string, data: Partial<QRCodeRequest>): Promise<QRCodeResponse> => {
  const response = await http.put(`/qr-codes/${id}`, data);
  return response.data;
};

export const deleteQRCode = async (id: string): Promise<void> => {
  await http.delete(`/qr-codes/${id}`);
};

export const getAllQRCodes = async (): Promise<QRCodeResponse[]> => {
  const response = await http.get('/qr-codes');
  return response.data.data; // Lấy data từ response.data.data thay vì response.data
};

export const updateQRCodeStatus = async (id: string, status: string): Promise<QRCodeResponse> => {
  const response = await http.patch(`/qr-codes/${id}/status`, { status });
  return response.data;
};
