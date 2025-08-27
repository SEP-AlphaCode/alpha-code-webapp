import http from '../utils/http';
import {QRCodeRequest, QRCodesResponse} from '@/types/qrcode';

export const createQRCode = async (data: QRCodeRequest): Promise<QRCodesResponse> => {
  const response = await http.post('/qrcode', data);
  return response.data;
};

export const getQRCodeById = async (id: string): Promise<QRCodesResponse> => {
  const response = await http.get(`/qr-codes/${id}`);
  return response.data;
};

export const updateQRCode = async (id: string, data: Partial<QRCodeRequest>): Promise<QRCodesResponse> => {
  const response = await http.put(`/qr-codes/${id}`, data);
  return response.data;
};

export const deleteQRCode = async (id: string): Promise<void> => {
  await http.delete(`/qr-codes/${id}`);
};

export const getAllQRCodes = async (): Promise<QRCodesResponse> => {
  try {
    const response = await http.get<QRCodesResponse>('/qr-codes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQRCodeStatus = async (id: string, status: string): Promise<QRCodesResponse> => {
  const response = await http.patch(`/qr-codes/${id}/status`, { status });
  return response.data;
};
