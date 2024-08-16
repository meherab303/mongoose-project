import { Schema, model } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const academicFacultySchema = new Schema<TAcademicFaculty>({
  name: {
    type: String,
    required: [true, "Faculty name is required"],
    unique: true,
  },
});

academicFacultySchema.pre("save", async function (next) {
  const isExist = await AcademicFaculty.findOne({ name: this.name });
  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "this faculty already exist");
  }
  next();
});

academicFacultySchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isExist = await AcademicFaculty.findOne(query);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "this faculty isn,t exist");
  }
  next();
});
export const AcademicFaculty = model<TAcademicFaculty>(
  "AcademicFaculty",
  academicFacultySchema
);
