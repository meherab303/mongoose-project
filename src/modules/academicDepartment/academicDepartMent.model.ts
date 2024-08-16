import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const academicDepartMentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    required: [true, "Department name is required"],
    unique: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: [true, "Faculty Id is Required"],
    ref: "AcademicFaculty",
  },
});

academicDepartMentSchema.pre("save", async function (next) {
  const isExist = await AcademicDepartMent.findOne({ name: this.name });
  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "this department already Exist ");
  }
  next();
});

academicDepartMentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();

  const isDepartMentExist = await AcademicDepartMent.findOne(query);
  if (!isDepartMentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "departMent id is not found");
  }
  next();
});

export const AcademicDepartMent = model<TAcademicDepartment>(
  "AcademicDepartMent",
  academicDepartMentSchema
);
