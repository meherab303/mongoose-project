/* eslint-disable @typescript-eslint/no-misused-promises */
import { NextFunction, Request, Response } from "express";

import catchAsync from "../modules/utils/catchAsync";
import AppError from "../errors/appError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../app/config";
import { TUSerRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...UserRoles: TUSerRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
    }
    const decoded = jwt.verify(token, config?.JWT_ACCESS_SECRET as string);
    const { userId, role, iat } = decoded as JwtPayload;
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

    if (UserRoles.length > 0 && !UserRoles.includes(role as TUSerRole)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
    }
    // if password is changed after jwt issued
    const passWordChangeTime = user?.passwordChangeAt;
    if (
      passWordChangeTime &&
      User.isJWTissuedBeforePasswordChanged(passWordChangeTime, iat as number)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized");
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
