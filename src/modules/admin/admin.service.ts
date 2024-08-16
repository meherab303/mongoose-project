import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { AdminSearchableFields } from "./admin.constant";
import { Admin } from "./admin.model";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { User } from "../user/user.model";

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find().populate("user"), query)
    .partialSearch(AdminSearchableFields)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();
  const result = await adminQuery.queryModel;
  const meta = await adminQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id).populate("user");
  return result;
};
const updateAdminIntoDB = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const { name, ...remainingAdminData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete admin");
    }
    const userId = deletedAdmin.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete user");
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("failed to delete admin");
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
