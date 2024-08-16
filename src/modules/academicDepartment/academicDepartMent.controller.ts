/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { AcademicDepartMentServices } from "./academicDepartMent.service";

const createAcademicDepartMent = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartMentServices.createAcademicDepartMentIntoDb(req.body);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "AcademicDepartment is created Successfully",
    data: result,
  });
});
const getAllAcademicDepartMent = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartMentServices.getAllAcademicDepartMentFromDb(req.query);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Academic Departments are retrieve Successfully",
    meta: result.meta,
    data: result.result,
  });
});
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departMentId } = req.params;
  const result =
    await AcademicDepartMentServices.getSingleAcademicDepartMentFromDb(
      departMentId
    );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Academic Department is retrieve Successfully",
    data: result,
  });
});
const updateSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departMentId } = req.params;
  const result =
    await AcademicDepartMentServices.updateSingleAcademicDepartMentIntoDb(
      departMentId,
      req.body
    );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "AcademicDepartMent is updated Successfully",
    data: result,
  });
});
export const AcademicDepartMentControllers = {
  createAcademicDepartMent,
  getAllAcademicDepartMent,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment,
};
