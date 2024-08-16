import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";
// studentLast Id
const findLastId = async () => {
  const lastStudentId = await User.findOne({ role: "student" })
    .select({ id: 1 })
    .lean()
    .sort({ createdAt: -1 });
  return lastStudentId?.id ? lastStudentId.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  const lastStudentId = await findLastId();
  const lastStudentIdYear = lastStudentId?.substring(0, 4);
  const lastStudentIdCode = lastStudentId?.substring(4, 6);

  let currentId = (0).toString();
  if (
    lastStudentIdYear === payload.year &&
    lastStudentIdCode === payload.code
  ) {
    currentId = lastStudentId?.substring(6) as string;
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

// faculty last id
const findLastFacultyId = async () => {
  const findLastFacultyId = await User.findOne({ role: "faculty" })
    .select({ id: 1 })
    .sort({ createdAt: -1 })
    .lean();
  return findLastFacultyId?.id ? findLastFacultyId.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  const LastFacultyId = await findLastFacultyId();

  let currentId = (0).toString();
  if (LastFacultyId) {
    currentId = LastFacultyId;
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `F-${incrementId}`;
  return incrementId;
};
const findLastAdminId = async () => {
  const findLastAdminId = await User.findOne({ role: "admin" })
    .select({ id: 1 })
    .sort({ createdAt: -1 })
    .lean();
  return findLastAdminId?.id ? findLastAdminId.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  const lastAdminId = await findLastAdminId();
  let currentId = (0).toString();
  if (lastAdminId) {
    currentId = lastAdminId;
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `A-${incrementId}`;
  return incrementId;
};
