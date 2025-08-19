export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
   token: string;
  account: {
    id: string;
    username: string;
    password: string;
    fullName: string;
    phone: string;
    email: string;
    gender: number;
    createdDate: string;
    lastEdited: string;
    status: number;
    image: string;
    bannedReason: string;
    roleId: string;
    roleName: string;
  };
}
