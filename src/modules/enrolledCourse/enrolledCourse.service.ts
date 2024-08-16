/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { Student } from "../student/student.model";
import EnrolledCourse from "./enrolledCourse.model";

import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { Course } from "../course/course.model";
import mongoose from "mongoose";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Faculty } from "../faculty/faculty.model";
import { calculateMarks } from "./enrolledCourse.utils";
import QueryBuilder from "../../app/builder/QueryBuilder";

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: { offeredCourse: string }
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "offered course is not found ");
  }
  if (isOfferedCourseExist.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Room is full ");
  }
  const student = await Student.findOne({ id: userId }).select("id");
  console.log(student);
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "student is not found ");
  }
  const semesterRegistrationId = isOfferedCourseExist.semesterRegistration;
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: semesterRegistrationId,
    offeredCourse,
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, "Course is already enrolled  ");
  }

  const semesterRegistration = await SemesterRegistration.findById(
    semesterRegistrationId
  ).select("maxCredit");
  const maxCredit = semesterRegistration?.maxCredit;
  // current credit
  const course = await Course.findById(isOfferedCourseExist.course).select(
    "credits"
  );
  const currentCredit = course?.credits;
  // total credit
  const enrolledCredits = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: semesterRegistrationId,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "enrolledCourses",
      },
    },
    {
      $unwind: "$enrolledCourses",
    },
    {
      $group: { _id: null, totalCredits: { $sum: "$enrolledCourses.credits" } },
    },
    {
      $project: { _id: 0, totalCredits: 1 },
    },
  ]);

  const isEnrolledCreditExist = enrolledCredits?.length;
  const totalEnrolledCredits =
    isEnrolledCreditExist > 0 ? enrolledCredits[0]?.totalCredits : 0;

  if (
    totalEnrolledCredits &&
    maxCredit &&
    totalEnrolledCredits + currentCredit > maxCredit
  ) {
    throw new AppError(httpStatus.FORBIDDEN, "Credit  is fulled");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          academicSemester: isOfferedCourseExist.academicSemester,
          academicFaculty: isOfferedCourseExist.academicFaculty,
          academicDepartment: isOfferedCourseExist.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExist.course,
          student: student._id,
          faculty: isOfferedCourseExist.faculty,
          isEnrolled: true,
        },
      ],
      { session }
    );
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to enroll in this course !"
      );
    }

    const maxCapacity = isOfferedCourseExist.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { runValidators: true, new: true }
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>
) => {
  const student = await Student.findOne({ id: studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "Student not found !");
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      "semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty"
    ),
    query
  )
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();

  const result = await enrolledCourseQuery.queryModel;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, courseMarks, student } = payload;
  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "offered course is not found ");
  }
  const isStudentExist = await Student.findById(student);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "student is not found ");
  }
  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, "semester is not found ");
  }
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, "faculty is not found ");
  }

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });
  if (!isCourseBelongsToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, "you are forbidden ");
  }

  const modifiedData: Record<string, unknown> = {};

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } = courseMarks;
    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);
    const result = calculateMarks(totalMarks);
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length > 0) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty._id,
    modifiedData,
    { new: true }
  );

  return result;
};
export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getMyEnrolledCoursesFromDB,
};
