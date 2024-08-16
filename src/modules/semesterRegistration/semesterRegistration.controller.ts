/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../utils/catchAsync";
import { SemesterRegistrationService } from "./semesterRegistration.service";
import { TSemesterRegistration } from "./semesterRegistration.interface";

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.createSemesterRegistrationIntoDB(
        req.body as TSemesterRegistration
      );
    return res.status(httpStatus.OK).json({
      success: true,
      message: "semesterRegistration is created successfully",
      data: result,
    });
  }
);

const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
        req.query
      );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "semesterRegistration are retrieve successfully",
      meta: result.meta,
      data: result.result,
    });
  }
);

const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await SemesterRegistrationService.getSingleSemesterRegistrationsFromDB(
        id
      );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "semesterRegistration is retrieve successfully",
      data: result,
    });
  }
);

const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
        id,
        req.body as Partial<TSemesterRegistration>
      );

    return res.status(httpStatus.OK).json({
      success: true,
      message: "semesterRegistration is updated successfully",
      data: result,
    });
  }
);

const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.deleteSemesterRegistrationFromDB(id);

    return res.status(httpStatus.OK).json({
      success: true,
      message: "semesterRegistration is deleted successfully",
      data: result,
    });
  }
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
