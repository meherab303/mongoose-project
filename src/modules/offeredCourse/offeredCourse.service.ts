import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartMent } from "../academicDepartment/academicDepartMent.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";

import { RegistrationStatus } from "../semesterRegistration/semesterRegistration.constant";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { Student } from "../student/student.model";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "semesterRegistration is not found"
    );
  }
  const semesterRegistrationStatus = isSemesterRegistrationExist?.status;
  if (semesterRegistrationStatus !== "UPCOMING") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you can not create a offered course with this semester registration as it is ${semesterRegistrationStatus}`
    );
  }
  const academicSemester = isSemesterRegistrationExist.academicSemester;

  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "academicFaculty is not found");
  }
  const isAcademicDepartmentExist =
    await AcademicDepartMent.findById(academicDepartment);

  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "academicDepartment is not found");
  }
  const isCourseExist = await Course.findById(course);

  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, "course is not found");
  }
  const isFacultyExist = await Faculty.findById(faculty);

  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "faculty is not found");
  }

  const isDepartmentBelongToFaculty = await AcademicDepartMent.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` ${isAcademicDepartmentExist.name} is not belong to  ${isAcademicFacultyExist.name}`
    );
  }
  const isSameOfferedCourseExistWithSameCourseWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (isSameOfferedCourseExistWithSameCourseWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "same offered course with same course with same section is already exist"
    );
  }

  const assignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");

  if (hasTimeConflict(assignSchedule, startTime, endTime)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "this faculty is not available at this time!choose another time"
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};
const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();

  const result = await offeredCourseQuery.queryModel;
  const meta = await offeredCourseQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, "user is not found");
  }
  const currentOngoingSemesterRegistration = await SemesterRegistration.findOne(
    { status: RegistrationStatus.ONGOING }
  );
  if (!currentOngoingSemesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "There is no current ongoing semester registration"
    );
  }
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 1;
  const skip = (page - 1) * limit;
  const aggregateQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingSemesterRegistration?._id,
        academicDepartment: student.academicDepartMent,
        academicFaculty: student.academicFaculty,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentOngoingSemesterRegistration:
            currentOngoingSemesterRegistration._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$semesterRegistration",
                      "$$currentOngoingSemesterRegistration",
                    ],
                  },
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isEnrolled", true],
                  },
                ],
              },
            },
          },
        ],
        as: "enrolledCourse",
      },
    },
    {
      $addFields: {
        isAlreadyEnrolled: {
          $in: [
            "$course._id",
            {
              $map: {
                input: "$enrolledCourse",
                as: "enroll",
                in: "$$enroll.course",
              },
            },
          ],
        },
      },
    },

    {
      $lookup: {
        from: "enrolledcourses",
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$student", "$$currentStudent"],
                  },
                  {
                    $eq: ["$isCompleted", true],
                  },
                ],
              },
            },
          },
        ],
        as: "completedCourses",
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: "$completedCourses",
            as: "completed",
            in: "$$completed.course",
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ["$course.preRequisiteCourses", []] },
            {
              $setIsSubset: [
                "$course.preRequisiteCourses.course",
                "$completedCourseIds",
              ],
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];
  const paginationQuery = [{ $skip: skip }, { $limit: limit }];
  const result = await OfferedCourse.aggregate([
    ...aggregateQuery,
    ...paginationQuery,
  ]);
  const totalDocuments = (await OfferedCourse.aggregate([...aggregateQuery]))
    .length;
  const totalPage = Math.ceil(totalDocuments / limit);
  const meta = {
    page,
    limit,
    totalDocuments,
    totalPage,
  };
  return { result, meta };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    "faculty" | "maxCapacity" | "days" | "startTime" | "endTime"
  >
) => {
  const { faculty, days, startTime, endTime } = payload;
  const isOfferedCoursesExist = await OfferedCourse.findById(id);
  if (!isOfferedCoursesExist) {
    throw new AppError(httpStatus.NOT_FOUND, "offered courses is not found");
  }
  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, "faculty is not found");
  }
  const semesterRegistration = isOfferedCoursesExist?.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `you can not update the offered course as it is ${semesterRegistrationStatus?.status}`
    );
  }
  const assignSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select("days startTime endTime");
  if (hasTimeConflict(assignSchedule, startTime, endTime)) {
    throw new AppError(
      httpStatus.CONFLICT,
      "this faculty is not available at this time!choose another schedule"
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCoursesExist = await OfferedCourse.findById(id);
  if (!isOfferedCoursesExist) {
    throw new AppError(httpStatus.NOT_FOUND, "offered course is not exist");
  }
  const semesterRegistration = isOfferedCoursesExist.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select("status");
  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `offered course can not delete because the offered course is ${semesterRegistrationStatus?.status}`
    );
  }
  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
  deleteOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
};
