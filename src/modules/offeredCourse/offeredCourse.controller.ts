/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";
import httpStatus from "http-status";
import { TOfferedCourse } from "./offeredCourse.interface";

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body as TOfferedCourse
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Offered Course is created successfully",
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Offered Course are retrieved successfully",
    data: result,
  });
});

const getSingleOfferedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
    return res.status(httpStatus.OK).json({
      success: true,
      message: "Offered Course is retrieved successfully",
      data: result,
    });
  }
);
const getMyOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId as string;

  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "My Offered Course is retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body as Pick<
      TOfferedCourse,
      "faculty" | "maxCapacity" | "days" | "startTime" | "endTime"
    >
  );
  return res.status(httpStatus.OK).json({
    success: true,
    message: "Offered Course is updated successfully",
    data: result,
  });
});

const deleteOfferedCourseFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
    return res.status(httpStatus.OK).json({
      success: true,
      message: "offered course is deleted successfully",
      data: result,
    });
  }
);

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  getMyOfferedCourses,
  updateOfferedCourse,
  deleteOfferedCourseFromDB,
};
