/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../app/config";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { userStatus } from "./user.constant";

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,

      select: 0,
    },
    passwordChangeAt: { type: Date },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    needPassWordChange: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: userStatus,
      default: "in-progress",
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "student", "faculty"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// document middleware

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcrypt.hash(user.password, Number(config.SALT_ROUND));

  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.pre("save", async function (next) {
  const isEmailExist = await User.findOne({ email: this.email });
  if (isEmailExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "this email already exist user cant be created"
    );
  }
  next();
});

userSchema.statics.isUserExistByCustomId = async function (id: string) {
  return await User.findOne({ id }).select("+password");
};
userSchema.statics.isPasswordMatched = async function (
  plaintextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};
userSchema.statics.isJWTissuedBeforePasswordChanged = function (
  passwordChangedTimeSpan: Date,
  jwtIssuedTimeSpan: number
) {
  const jwtIssuedTimeSpanInMiLiSecond = new Date(jwtIssuedTimeSpan * 1000);
  // const passwordChangedTimeSpanInSecond =
  //   new Date(passwordChangedTimeSpan).getTime() / 1000;
  return passwordChangedTimeSpan > jwtIssuedTimeSpanInMiLiSecond;
};

export const User = model<TUser, UserModel>("User", userSchema);
