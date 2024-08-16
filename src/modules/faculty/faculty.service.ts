import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { FacultySearchableFields } from "./faculty.constant";
import { Faculty } from "./faculty.model";
import { User } from "../user/user.model";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate("academicDepartment academicFaculty"),
    query
  )
    .partialSearch(FacultySearchableFields)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();
  const result = await facultyQuery.queryModel;
  const meta = await facultyQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate("academicDepartment");
  return result;
};

const updateFacultyIntoDB = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const { name, ...remainingFacultyData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to deleted faculty");
    }
    const UserID = deletedFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(
      UserID,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete user");
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Faculty Isn't deleted");
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
