export type TLoginUser = {
  id: string;
  password: string;
};
export type TPasswordChang = {
  oldPassword: string;
  newPassword: string;
};
export type TResetPass = { id: string; newPassword: string };
