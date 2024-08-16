import httpStatus from "http-status";
import QueryBuilder from "../../app/builder/QueryBuilder";
import AppError from "../../errors/appError";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { RegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  const academicSemester = payload?.academicSemester;

  //   check if there is any upcoming or ongoing semester still
  const isThereAnyUpcomingOrOngoingSemesterRegistration =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });
  if (isThereAnyUpcomingOrOngoingSemesterRegistration) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `there is already ${isThereAnyUpcomingOrOngoingSemesterRegistration?.status} semester`
    );
  }

  // check  if there academicSemester exist
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `this academicSemester  is not found`
    );
  }
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `this semester is already exist`
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();

  const result = await semesterRegistrationQuery.queryModel;
  const meta = await semesterRegistrationQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `this SemesterRegistration  is not found`
    );
  }
  const currentSemesterRegistrationStatus = isSemesterRegistrationExist?.status;

  if (currentSemesterRegistrationStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you cant not update the ${currentSemesterRegistrationStatus} semester`
    );
  }

  const requestedSemesterRegistrationStatus = payload?.status;

  if (
    currentSemesterRegistrationStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterRegistrationStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you cant not change directly from ${currentSemesterRegistrationStatus} to ${requestedSemesterRegistrationStatus}`
    );
  }
  if (
    currentSemesterRegistrationStatus === RegistrationStatus.ONGOING &&
    requestedSemesterRegistrationStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `you cant not change  from ${currentSemesterRegistrationStatus} to ${requestedSemesterRegistrationStatus}`
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `this SemesterRegistration  is not found`
    );
  }
  const result = await SemesterRegistration.findByIdAndDelete(id);
  return result;
};
export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
