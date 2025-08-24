export interface JWTPayload {
  id: string;
  fullName: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
  exp?: number;
  iat?: number;
}