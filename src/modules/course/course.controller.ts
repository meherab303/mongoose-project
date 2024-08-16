/* eslint-disable @typescript-eslint/no-misused-promises */
import httpStatus from "http-status";

import { CourseServices } from "./course.service";
import catchAsync from "../utils/catchAsync";
import { TCourse, TCourseFaculty } from "./course.interface";

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body as TCourse);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Course is created successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Course are retrieve successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Course is retrieve successfully",
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CourseServices.updateCourseIntoDB(
    id,
    req.body as Partial<TCourse>
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Course is updated successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Course is deleted successfully",
    data: result,
  });
});
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const { faculties } = req.body as Partial<TCourseFaculty>;
  console.log(faculties);
  const result = await CourseServices.assignFacultiesWithCourseIntoDb(
    courseId,
    faculties
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Faculties are assigned successfully",
    data: result,
  });
});
const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await CourseServices.getFacultiesWithCourseFromDb(courseId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Faculties WithCourse are retrieved successfully",
    data: result,
  });
});
const removeFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body as Partial<TCourseFaculty>;
  const result = await CourseServices.removeFacultiesWithCourseFromDb(
    courseId,
    faculties
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Faculties are remove successfully",
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getSingleCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  getFacultiesWithCourse,
  removeFacultiesWithCourse,
};
