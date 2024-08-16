import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
  id: string;
  password: string;
  passwordChangeAt?: Date;
  email: string;
  needPassWordChange?: boolean;
  status: "in-progress" | "blocked";
  role: "superAdmin" | "admin" | "student" | "faculty";
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plaintextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTissuedBeforePasswordChanged(
    passwordChangedTimeSpan: Date,
    jwtIssuedTimeSpan: number
  ): boolean;
}
export type TUSerRole = keyof typeof USER_ROLE;
