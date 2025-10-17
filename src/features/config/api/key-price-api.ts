import { KeyPrice } from '@/types/key-price';
import { paymentsHttp } from '@/utils/http';

// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const getKeyPrice = async (): Promise<KeyPrice> => {
  try {
    const response = await paymentsHttp.get('/key-prices');
    return response.data;
  } catch (error) {
    console.error('Error fetching key price:', error);
    throw new Error('Failed to fetch key price');
  }
};


export const createKeyPrice = async (price: number): Promise<KeyPrice> => {
  try {
    const response = await paymentsHttp.post('/key-prices', { price });
    return response.data;
  } catch (error) {
    console.error('Error creating key price:', error);
    throw new Error('Failed to create key price');
  }
};

export const updateKeyPrice = async (id: string, price: number): Promise<KeyPrice> => {
  try {
    const response = await paymentsHttp.put(`/key-prices/${id}`, null, {
      params: { price },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating key price:', error);
    throw new Error('Failed to update key price');
  }
};


export const deleteKeyPrice = async (id: string): Promise<void> => {
  try {
    await paymentsHttp.delete(`/key-prices/${id}`);
  } catch (error) {
    console.error('Error deleting key price:', error);
    throw new Error('Failed to delete key price');
  }
};
