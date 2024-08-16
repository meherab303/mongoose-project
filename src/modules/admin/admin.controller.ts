/* eslint-disable @typescript-eslint/no-misused-promises */
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { AdminServices } from "./admin.service";

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);
  return res.status(httpStatus.OK).json({
    success: true,
    message: "admin is retrieve successfully",
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "admin are retrieve successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body as Record<string, unknown>;
  const result = await AdminServices.updateAdminIntoDB(
    id,
    admin as Record<string, unknown>
  );

  return res.status(httpStatus.OK).json({
    success: true,
    message: "admin is updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);

  return res.status(httpStatus.OK).json({
    success: true,
    message: "admin is deleted successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
