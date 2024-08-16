/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

import { academicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.createAcademicSemesterIntoDb(
    req.body
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Academic Semester is created successfully",
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAllAcademicSemesterFromDb(
    req.query
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "All Academic Semester retrieve is successful",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;

  const result =
    await academicSemesterServices.getSingleAcademicSemesterFromDb(semesterId);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "semester isn,t retrieve",
      data: "nai",
    });
  }
  return res.status(httpStatus.OK).json({
    success: true,
    message: "single AcademicSemester is retrieve successful",
    data: result,
  });
});
const updateSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await academicSemesterServices.updateSingleAcademicSemesterIntoDb(
      semesterId,
      req.body
    );

  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "semester isn,t retrieve",
      data: "nai",
    });
  }
  return res.status(httpStatus.OK).json({
    success: true,
    message: "single AcademicSemester updated successful",
    data: result,
  });
});
export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
};
