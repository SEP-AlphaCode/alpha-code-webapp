import { jwtDecode } from 'jwt-decode';

// JWT utility functions for token validation
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode JWT token using jwt-decode library
    const payload = jwtDecode(token);
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

export const getTokenPayload = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token payload:', error);
    return null;
  }
};

export const isValidToken = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // Basic JWT format check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Try to decode the token to validate structure
    jwtDecode(token);
    
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
  sessionStorage.removeItem('account');
};
