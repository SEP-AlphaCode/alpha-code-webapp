import { jwtDecode } from 'jwt-decode';

// JWT Payload interface based on your token structure
export interface JWTPayload {
  sub: string;
  email: string;
  roleName: string;
  username: string;
  id: string;
  roleId: string;
  fullName: string;
  iat: number;
  exp: number;
}

// Account data interface for session storage
export interface AccountData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleName: string;
  roleId: string;
}

// Function to extract and save account data from JWT token to session storage
export const saveAccountDataFromToken = (token: string): AccountData | null => {
  try {
    const payload = jwtDecode<JWTPayload>(token);
    
    const accountData: AccountData = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
      roleName: payload.roleName,
      roleId: payload.roleId
    };
    
    // Save to session storage
    sessionStorage.setItem('account', JSON.stringify(accountData));
    console.log('Account data saved to session storage:', accountData);
    
    return accountData;
  } catch (error) {
    console.error('Error extracting account data from token:', error);
    return null;
  }
};

// Function to get account data from session storage
export const getAccountDataFromStorage = (): AccountData | null => {
  try {
    const accountStr = sessionStorage.getItem('account');
    if (accountStr) {
      return JSON.parse(accountStr) as AccountData;
    }
    return null;
  } catch (error) {
    console.error('Error parsing account data from session storage:', error);
    return null;
  }
};

export const getRoleFromToken = (token: string): string | null => {
  try {
    // Decode JWT token to get role information
    const payload = jwtDecode(token) as any;
    
    // Check for common role field names in JWT payload
    const role = payload.role || 
                 payload.userRole || 
                 payload.roleName || 
                 payload.user_role ||
                 (payload.authorities && Array.isArray(payload.authorities) ? payload.authorities[0] : null) ||
                 payload.scope;
    
    if (typeof role === 'string') {
      return role;
    } else if (Array.isArray(role) && role.length > 0) {
      return role[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error decoding token for role:', error);
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = jwtDecode(token) as any;
    
    // Check for common user ID field names
    const userId = payload.sub || 
                   payload.userId || 
                   payload.user_id ||
                   payload.id;
                   
    return userId ? String(userId) : null;
  } catch (error) {
    console.error('Error decoding token for user ID:', error);
    return null;
  }
};

export const getUsernameFromToken = (token: string): string | null => {
  try {
    const payload = jwtDecode(token) as any;
    
    // Check for common username field names
    const username = payload.username || 
                     payload.user_name ||
                     payload.preferred_username ||
                     payload.name ||
                     payload.email;
                     
    return username ? String(username) : null;
  } catch (error) {
    console.error('Error decoding token for username:', error);
    return null;
  }
};

export const getRoleFromUsername = (username: string): string => {
  // Temporary logic - you can customize this
  // For example, if admin usernames follow a pattern
  if (username.toLowerCase().includes('admin')) {
    return 'admin';
  } else if (username.toLowerCase().includes('teacher')) {
    return 'teacher';
  } else {
    return 'student';
  }
};

export const determineUserRole = (): string => {
  const accessToken = sessionStorage.getItem('accessToken');
  
  if (accessToken) {
    // First try to get role from token
    const roleFromToken = getRoleFromToken(accessToken);
    if (roleFromToken) {
      return roleFromToken;
    }
  }
  
  // If no role in token, default to admin for now
  // You can implement other logic here
  return 'admin';
};
