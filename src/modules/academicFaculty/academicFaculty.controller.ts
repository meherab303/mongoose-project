/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDb(
    req.body
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "AcademicFaculty is created Successfully",
    data: result,
  });
});
const getAllAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultyFromDb(
    req.query
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "All AcademicFaculty is retrieve Successfully",
    meta: result.meta,
    data: result.result,
  });
});
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await AcademicFacultyServices.getSingleAcademicFacultyFromDb(facultyId);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Single AcademicFaculty is retrieve Successfully",
    data: result,
  });
});
const updateSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await AcademicFacultyServices.updateSingleAcademicFacultyIntoDb(
      facultyId,
      req.body
    );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "AcademicFaculty is updated Successfully",
    data: result,
  });
});
export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty,
};
