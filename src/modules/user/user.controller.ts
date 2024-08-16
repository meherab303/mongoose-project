/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import userValidationSchema from "./user.validation";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDb(
    req.file,
    password,
    studentData
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "student is created successfully",
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDb(
    req.file,
    password,
    facultyData
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "faculty is created successfully",
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDb(
    req.file,
    password,
    adminData
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "admin is created successfully",
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req.user);

  const name = result?.name?.firstName;

  return res.status(httpStatus.OK).json({
    success: true,
    message: ` Hello ${name}.Here is your information`,
    data: result,
  });
});
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await UserServices.changeStatus(id, status);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "User status is updated successfully",
    data: result,
  });
});
export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
