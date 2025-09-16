import {QRCodeRequest, QRCodesResponse} from '@/types/qrcode';
import { springHttp } from '@/utils/http';

export const createQRCode = async (data: QRCodeRequest): Promise<QRCodesResponse> => {
  const response = await springHttp.post('/qrcode', data);
  return response.data;
};

export const getQRCodeById = async (id: string): Promise<QRCodesResponse> => {
  const response = await springHttp.get(`/qr-codes/${id}`);
  return response.data;
};

export const updateQRCode = async (id: string, data: Partial<QRCodeRequest>): Promise<QRCodesResponse> => {
  const response = await springHttp.put(`/qr-codes/${id}`, data);
  return response.data;
};

export const deleteQRCode = async (id: string): Promise<void> => {
  await springHttp.delete(`/qr-codes/${id}`);
};

export const getAllQRCodes = async (): Promise<QRCodesResponse> => {
  try {
    const response = await springHttp.get<QRCodesResponse>('/qr-codes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQRCodeStatus = async (id: string, status: string): Promise<QRCodesResponse> => {
  const response = await springHttp.patch(`/qr-codes/${id}/status`, { status });
  return response.data;
};
