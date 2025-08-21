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
    lastEdited: string | null;
    status: number;
    image: string;
    bannedReason: string | null;
    roleId: string;
    roleName: string;
  };
}
