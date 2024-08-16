import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TMonth,
} from "./academicSemester.interface";

export const Months: TMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const AcademicSemesterName: TAcademicSemesterName[] = [
  "autumn",
  "summer",
  "fall",
];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ["01", "02", "03"];
export const AcademicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  autumn: "01",
  summer: "02",
  fall: "03",
};
export const AcademicSemesterSearchableFields = ["name", "year"];
