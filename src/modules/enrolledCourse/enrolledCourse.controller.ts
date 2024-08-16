/* eslint-disable @typescript-eslint/no-misused-promises */
import httpStatus from "http-status";

import { EnrolledCourseServices } from "./enrolledCourse.service";
import catchAsync from "../utils/catchAsync";
import { TEnrolledCourse } from "./enrolledCourse.interface";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId as string,
    req.body as { offeredCourse: string }
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "students is enrolled successfully",
    data: result,
  });
});
const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId as string;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId,
    req.query
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "students is enrolled successfully",
    meta: result.meta,
    data: result.result,
  });
});
const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId as string;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body as Partial<TEnrolledCourse>
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "marks is updated successfully",
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
