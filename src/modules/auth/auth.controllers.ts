/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { TLoginUser, TPasswordChang, TResetPass } from "./auth.interface";
import config from "../../app/config";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body as TLoginUser);
  const { refreshToken, accessToken, needPasswordChange } = result;
  // set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    secure: config.Node_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  return res.status(httpStatus.OK).json({
    success: true,
    message: "logged in successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  console.log(req.user, req.body);
  const { ...passWordData } = req.body as TPasswordChang;
  const result = await AuthServices.changePassword(req.user, passWordData);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "password updated successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken as string);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "access token is retrieved  successfully",
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await AuthServices.forgetPassword(id as string);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "reset Link is generated successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers?.authorization;
  const result = await AuthServices.resetPassword(
    req.body as TResetPass,
    token as string
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "password  reset successful",
    data: result,
  });
});
export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
