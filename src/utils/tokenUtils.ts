import { JWTPayload } from '@/types/jwt-payload';
import { jwtDecode } from 'jwt-decode';

// Interface cho JWT payload


// JWT utility functions for token validation
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode JWT token using jwt-decode library
    const payload = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    
    if (!payload.exp) {
      // If no expiration time, consider token as expired for safety
      return true;
    }
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider invalid tokens as expired
  }
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  if (!token || token.trim() === '') {
    return null;
  }
  
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding token payload:', error);
    return null;
  }
};

// Utility functions để lấy thông tin từ token
export const getUserInfoFromToken = (token: string): Partial<JWTPayload> | null => {
  const payload = getTokenPayload(token);
  if (!payload) return null;
  
  return {
    id: payload.id,
    fullName: payload.fullName,
    username: payload.username,
    email: payload.email,
    roleId: payload.roleId,
    roleName: payload.roleName
  };
};

export const getUserRoleFromToken = (token: string): string | null => {
  const payload = getTokenPayload(token);
  return payload?.roleName || null;
};

export const getUserIdFromToken = (token: string): string | null => {
  const payload = getTokenPayload(token);
  return payload?.id || null;
};

export const isValidToken = (token: string): boolean => {
  if (!token || token.trim() === '') return false;
  
  try {
    // Basic JWT format check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Try to decode the token to validate structure
    jwtDecode<JWTPayload>(token);
    
    // Check if token is not expired
    return !isTokenExpired(token);
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const clearAuthData = (): void => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};
