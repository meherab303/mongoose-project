import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { User } from "../user/user.model";
import { TLoginUser, TPasswordChang, TResetPass } from "./auth.interface";
import { JwtPayload } from "jsonwebtoken";
import config from "../../app/config";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils";

import { sendEmail } from "../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;
  const user = await User.isUserExistByCustomId(id);

  //   check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }
  //   check if the user is deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
  }
  //    check if the user status is blocked
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "user is blocked");
  }
  //   check clients given password is right

  if (!(await User.isPasswordMatched(password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "wrong password");
  }
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config?.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config?.JWT_REFRESH_SECRET as string,
    config?.JWT_REFRESH_EXPIRES_IN as string
  );

  return {
    accessToken,
    needPasswordChange: user?.needPassWordChange,
    refreshToken,
  };
};

const changePassword = async (user: JwtPayload, payload: TPasswordChang) => {
  const { userId, role } = user;
  const { oldPassword, newPassword } = payload;
  const userData = await User.isUserExistByCustomId(userId as string);
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }
  const isUserDeleted = userData?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
  }
  //    check if the user status is blocked
  const userStatus = userData?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "user is blocked");
  }
  //   check clients given password is right

  if (!(await User.isPasswordMatched(oldPassword, userData?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "wrong password");
  }

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.SALT_ROUND)
  );

  await User.findOneAndUpdate(
    {
      id: userId as string,
      role: role as string,
    },
    {
      password: hashedNewPassword,
      needPassWordChange: false,
      passwordChangeAt: new Date(),
    },
    {
      runValidators: true,
      new: true,
    }
  );
  return null;
};
const refreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(
    refreshToken,
    config.JWT_REFRESH_SECRET as string
  );
  const { userId, iat } = decoded as JwtPayload;
  const user = await User.isUserExistByCustomId(userId as string);

  //   check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }
  //   check if the user is deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
  }
  //    check if the user status is blocked
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "user is blocked");
  }

  // if password is changed after jwt issued
  const passWordChangeTime = user?.passwordChangeAt;
  if (
    passWordChangeTime &&
    User.isJWTissuedBeforePasswordChanged(passWordChangeTime, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
  }
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config?.JWT_ACCESS_SECRET as string,
    config?.JWT_ACCESS_EXPIRES_IN as string
  );
  return accessToken;
};
const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistByCustomId(userId);

  //   check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }
  //   check if the user is deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
  }
  //    check if the user status is blocked
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "user is blocked");
  }
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };
  const resetToken = createToken(
    jwtPayload,
    config?.JWT_ACCESS_SECRET as string,
    "10m"
  );

  const resetUiLink = `${config.reset_password_ui_link}?id=${user.id}&token=${resetToken}`;

  await sendEmail(user.email, resetUiLink);
};
const resetPassword = async (payload: TResetPass, token: string) => {
  const user = await User.isUserExistByCustomId(payload.id);

  //   check if the user is exist
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }
  //   check if the user is deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "user is deleted");
  }
  //    check if the user status is blocked
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "user is blocked");
  }

  const decoded = verifyToken(
    token,
    config.JWT_ACCESS_SECRET as string
  ) as JwtPayload;

  if (user.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "you are forbidden");
  }
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.SALT_ROUND)
  );
  await User.findOneAndUpdate(
    { id: decoded.userId as string, role: decoded.role as string },
    {
      password: newHashedPassword,
      needPassWordChange: false,
      passwordChangeAt: new Date(),
    },
    {
      runValidators: true,
      new: true,
    }
  );
  return null;
};
export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
