/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import validateData from "../../middleware/validateData";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controllers";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

router.post(
  "/login",
  validateData(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser
);
router.post(
  "/change-password",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  validateData(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword
);
router.post(
  "/refresh-token",
  validateData(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);
router.post(
  "/forget-password",
  validateData(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);
router.post(
  "/reset-password",
  validateData(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);
export const AuthRoutes = router;
