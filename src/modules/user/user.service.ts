import mongoose from "mongoose";
import config from "../../app/config";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { TStudent } from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from "./user.utils";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartMent } from "../academicDepartment/academicDepartMent.model";
import { Faculty } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";

import { JwtPayload } from "jsonwebtoken";
import { sendImageToCloudinary } from "../utils/sendImageToCloudinary";

const createStudentIntoDb = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = "student";

  userData.email = payload.email;

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );
  if (admissionSemester) {
    userData.id = await generateStudentId(admissionSemester);
  } else {
    throw new Error("admission semester not found");
  }
  const academicDepartment = await AcademicDepartMent.findById(
    payload.academicDepartMent
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;
  // create e isolated enviroment
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (file) {
      const imageName = `${userData.id}-${payload?.name?.firstName}`;
      const pathName = file?.path;
      const protoHostingDetails = await sendImageToCloudinary(
        imageName,
        pathName
      );
      payload.profileImg = protoHostingDetails?.secure_url;
    }

    // transaction-1
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to User student");
    }

    /* if (Object.keys(newUser).length) {
      payload.id = newUser.id;
      payload.user = newUser._id;
    }
    */

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // transaction-2

    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create student");
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDb = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  const userData: Partial<TUser> = {};
  userData.role = "faculty";
  userData.password = password || (config.default_pass as string);
  userData.email = payload.email;
  // find academic department info
  const academicDepartment = await AcademicDepartMent.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();
    if (file) {
      const imageName = `${userData.id}-${payload?.name?.firstName}`;
      const pathName = file?.path;
      const protoHostingDetails = await sendImageToCloudinary(
        imageName,
        pathName
      );
      payload.profileImg = protoHostingDetails?.secure_url;
    }
    const newUSer = await User.create([userData], { session });
    if (!newUSer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed To create User");
    }
    payload.id = newUSer[0].id;
    payload.user = newUSer[0]._id;

    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed To create Faculty");
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const createAdminIntoDb = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  const userData: Partial<TUser> = {};
  userData.role = "admin";
  userData.password = password || (config.default_pass as string);
  userData.email = payload.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateAdminId();
    if (file) {
      const imageName = `${userData.id}-${payload?.name?.firstName}`;
      const pathName = file?.path;
      const protoHostingDetails = await sendImageToCloudinary(
        imageName,
        pathName
      );
      payload.profileImg = protoHostingDetails?.secure_url;
    }
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed To create User");
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed To create Admin");
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (payload: JwtPayload) => {
  const { userId, role } = payload;
  let result = null;
  if (role === "student") {
    result = await Student.findOne({ id: userId });
  }
  if (role === "admin") {
    result = await Admin.findOne({ id: userId });
  }
  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId });
  }

  return result;
};
const changeStatus = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  return result;
};

export const UserServices = {
  createStudentIntoDb,
  createFacultyIntoDb,
  createAdminIntoDb,
  getMe,
  changeStatus,
};
