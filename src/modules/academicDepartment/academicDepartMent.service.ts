import QueryBuilder from "../../app/builder/QueryBuilder";
import { AcademicDepartMent } from "./academicDepartMent.model";
import { AcademicDepartmentSearchableFields } from "./academicDepartment.constant";
import { TAcademicDepartment } from "./academicDepartment.interface";

const createAcademicDepartMentIntoDb = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartMent.create(payload);
  return result;
};
const getAllAcademicDepartMentFromDb = async (
  query: Record<string, unknown>
) => {
  const departmentQuery = new QueryBuilder(
    AcademicDepartMent.find().populate("academicFaculty"),
    query
  )
    .partialSearch(AcademicDepartmentSearchableFields)
    .queryFilter()
    .querySorting()
    .paginated()
    .fieldLimiting();
  const result = await departmentQuery.queryModel;
  const meta = await departmentQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleAcademicDepartMentFromDb = async (departMentId: string) => {
  const result = await AcademicDepartMent.findOne({
    _id: departMentId,
  }).populate("academicFaculty");
  return result;
};
const updateSingleAcademicDepartMentIntoDb = async (
  departMentId: string,
  payload: Partial<TAcademicDepartment>
) => {
  const result = await AcademicDepartMent.findOneAndUpdate(
    { _id: departMentId },
    payload,
    { new: true }
  );
  return result;
};

export const AcademicDepartMentServices = {
  createAcademicDepartMentIntoDb,
  getAllAcademicDepartMentFromDb,
  getSingleAcademicDepartMentFromDb,
  updateSingleAcademicDepartMentIntoDb,
};
