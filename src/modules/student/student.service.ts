// import { Aggregate } from "mongoose";
import mongoose from "mongoose";
import { Student } from "./student.model";
import { User } from "../user/user.model";

import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { searchTermField } from "./student.constant";

// import { TStudent } from "./student.interface";

// const createStudentIntoDb = async (studentData: TStudent) => {
//   // custom static method
//   if (await Student.isUserExists(studentData.id)) {
//     throw new Error("User Already exists");
//   }
//   const result = await Student.create(studentData); //BUILD IN STATIC METHOD

//   // const student = new Student(studentData); // builtin instatnce method

//   // QUERY USING MONGOOSE CUSTOM INSTANCE
//   // if (await student.isUserExist(studentData.id)) {
//   //   throw new Error("User Already exists");
//   // }

//   // const result = student.save();
//   return result;
// };
const getAllStudentFromDb = async (query: Record<string, unknown>) => {
  // let searchTerm = "";
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // type TCondition = {
  //   [key: string]: {
  //     $regex: string;
  //     $options: string;
  //   };
  // };
  // const copyBaseQuery = { ...query };
  // const excludeField = ["searchTerm", "sort", "limit", "page", "fields"];

  // excludeField.forEach((elem) => delete copyBaseQuery[elem]);

  // const orConditions = searchTermField.map((field) => {
  //   const condition: TCondition = {};
  //   condition[field] = { $regex: searchTerm, $options: "i" };
  //   return condition;
  // });
  // const result = await Student.find({
  //   $or: orConditions,
  // })
  //

  //  create {email:{$regex:'searchTerm,$options:"i"}}
  // const querySearchTerm = Student.find({
  //   $or: searchTermField.map((field) => {
  //     const orExpressions = { [field]: { $regex: searchTerm, $options: "i" } };
  //     return orExpressions;
  //   }),
  // })
  //   .populate("admissionSemester")
  //   .populate({
  //     path: "academicDepartMent",
  //     populate: {
  //       path: "academicFaculty",
  //     },
  //   });

  // const queryFiltering = querySearchTerm
  //   .find(copyBaseQuery)
  //   .populate("admissionSemester")
  //   .populate({
  //     path: "academicDepartMent",
  //     populate: {
  //       path: "academicFaculty",
  //     },
  //   });

  // let sort = "-createdAt";
  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const querySorting = queryFiltering.sort(sort);

  // let page = 1;
  // let limit = 4;
  // let skip = 0;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }
  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const queryPaginated = querySorting.skip(skip);

  // const queryLimiting = queryPaginated.limit(limit);
  // let fields = "-__v";
  // if (query.fields) {
  //   fields = (query.fields as string).split(",").join(" ");
  //   console.log(fields);
  // }
  // const queryFieldSelection = await queryLimiting.select(fields);
  // return queryFieldSelection;
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate("admissionSemester")
      .populate("academicDepartMent academicFaculty "),
    query
  )
    .partialSearch(searchTermField)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();

  const result = await studentQuery.queryModel;
  const meta = await studentQuery.countTotal();
  return { meta, result };
};
const getSingleStudentFromDb = async (id: string) => {
  const result = await Student.findById(id)
    .populate("admissionSemester")

    .populate({
      path: "academicDepartMent",
      populate: {
        path: "academicFaculty",
      },
    });

  return result;
};
const updateStudentIntoDb = async (
  studentId: string,
  payload: Partial<TStudent>
) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [Key, Value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${Key}`] = Value;
    }
  }

  const result = await Student.findByIdAndUpdate(
    studentId,
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const deleteSingleStudentFromDb = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete student");
    }

    const UserID = deletedStudent.user;

    const deletedUser = await User.findByIdAndUpdate(
      UserID,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to delete User");
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("student is not deleted");
  }
};
export const StudentService = {
  // createStudentIntoDb,
  getAllStudentFromDb,
  getSingleStudentFromDb,
  deleteSingleStudentFromDb,
  updateStudentIntoDb,
};
