import QueryBuilder from "../../app/builder/QueryBuilder";
import { AcademicFacultySearchableFields } from "./academicFaculty.costant";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDb = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};
const getAllAcademicFacultyFromDb = async (query: Record<string, unknown>) => {
  const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
    .partialSearch(AcademicFacultySearchableFields)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();

  const result = await academicFacultyQuery.queryModel;
  const meta = await academicFacultyQuery.countTotal();

  return {
    meta,
    result,
  };
};
const getSingleAcademicFacultyFromDb = async (facultyId: string) => {
  const result = await AcademicFaculty.findOne({ _id: facultyId });
  return result;
};
const updateSingleAcademicFacultyIntoDb = async (
  facultyId: string,
  payload: Partial<TAcademicFaculty>
) => {
  const result = await AcademicFaculty.findOneAndUpdate(
    { _id: facultyId },
    payload,
    { new: true }
  );
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDb,
  getAllAcademicFacultyFromDb,
  getSingleAcademicFacultyFromDb,
  updateSingleAcademicFacultyIntoDb,
};
