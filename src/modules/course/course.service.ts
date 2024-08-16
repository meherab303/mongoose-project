import { Course, CourseFaculty } from "./course.model";
import { TCourse } from "./course.interface";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import mongoose from "mongoose";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

import { Types } from "mongoose";

const createCourseIntoDB = async (payload: TCourse) => {
  const title = payload?.title;
  const code = payload?.code;

  const isExistTitle = await Course.findOne({ title });

  if (isExistTitle) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` title ${isExistTitle.title}  is already exist`
    );
  }
  const isExistCode = await Course.findOne({ code });

  if (isExistCode) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `code ${isExistCode.code} is already exist`
    );
  }

  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query
  )
    .partialSearch(CourseSearchableFields)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();

  const result = await courseQuery.queryModel;
  const meta = await courseQuery.countTotal();
  return {
    meta,
    result,
  };
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    "preRequisiteCourses.course"
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to update course");
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisites = preRequisiteCourses
        .filter((elem) => elem.course && elem.isDeleted)
        .map((elem) => elem.course);
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "failed to update course");
      }
      const newPreRequisites = preRequisiteCourses.filter(
        (elem) => elem.course && !elem.isDeleted
      );
      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "failed to update course");
      }
    }
    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      "preRequisiteCourses.course"
    );
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "failed to update course");
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};
const assignFacultiesWithCourseIntoDb = async (
  id: string,
  payload: Types.ObjectId[] | undefined
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true }
  );
  return result;
};
const getFacultiesWithCourseFromDb = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    "faculties"
  );
  return result;
};
const removeFacultiesWithCourseFromDb = async (
  id: string,
  payload: Types.ObjectId[] | undefined
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true }
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDb,
  getFacultiesWithCourseFromDb,
  removeFacultiesWithCourseFromDb,
};
