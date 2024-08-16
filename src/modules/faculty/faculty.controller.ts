/* eslint-disable @typescript-eslint/no-misused-promises */

import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync";
import { FacultyServices } from "./faculty.service";

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(id);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "faculty is retrieve successfully",
    data: result,
  });
});

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "faculty are retrieve successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body as Record<string, unknown>;
  const result = await FacultyServices.updateFacultyIntoDB(
    id,
    faculty as Record<string, unknown>
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "faculty is updated successfully",
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "faculty is deleted successfully",
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
