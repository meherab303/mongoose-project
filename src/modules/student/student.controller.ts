/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { StudentService } from "./student.service";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudentFromDb(req.query);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "students are retrieve successfully",
    meta: result.meta,
    data: result.meta,
  });
});
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentService.getSingleStudentFromDb(id);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "student is retrieve successfully",
    data: result,
  });
});

const deleteSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.deleteSingleStudentFromDb(id);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "student is deleted successfully",
    data: result,
  });
});
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentService.updateStudentIntoDb(id, student);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "student is updated successfully",
    data: result,
  });
});

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
  updateStudent,
};
