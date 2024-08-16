import QueryBuilder from "../../app/builder/QueryBuilder";
import {
  AcademicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDb = async (payload: TAcademicSemester) => {
  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("invalid Course Name code");
  }
  const result = await AcademicSemester.create(payload);
  return result;
};
const getAllAcademicSemesterFromDb = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .partialSearch(AcademicSemesterSearchableFields)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();
  const result = await academicSemesterQuery.queryModel;
  const meta = await academicSemesterQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleAcademicSemesterFromDb = async (semesterId: string) => {
  const result = await AcademicSemester.findOne({ _id: semesterId });
  return result;
};

const updateSingleAcademicSemesterIntoDb = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    AcademicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error("invalid Semester Code");
  }

  const result = await AcademicSemester.findOneAndUpdate(
    { _id: semesterId },
    payload,
    { new: true }
  );
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDb,
  getAllAcademicSemesterFromDb,
  getSingleAcademicSemesterFromDb,
  updateSingleAcademicSemesterIntoDb,
};
