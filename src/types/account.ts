export type Account = {
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

export type AccountData = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleName: string;
  roleId: string;
}
