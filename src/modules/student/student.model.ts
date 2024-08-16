import { Schema, model } from "mongoose";
import validator from "validator";
import {
  TGuardian,
  TLocalGuardian,
  TName,
  TStudent,
  StudentModel,
} from "./student.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const studentNameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: [true, "firstName is required"],
    trim: true,
    maxLength: [10, "firstName can not be more than 10 char"],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameFormat =
    //       value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    //     return value === firstNameFormat;
    //   },
    //   message: "{VALUE} is not in capitalize formate",
    // },
  },
  middleName: {
    type: String,
    trim: true,
    maxLength: [10, "middleName can not be more than 10 char"],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: [10, "lastName can not be more than 10 char"],
    // validate: {
    //   validator: (value: string) => {
    //     return validator.isAlpha(value);
    //   },
    //   message: "{VALUE} can contain only letters",
    // },
  },
});

const guardianNameSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});
const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: [true, "Id is Required"], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "user Id is Required"],
      ref: "User",
      unique: true,
    },

    name: {
      type: studentNameSchema,
      required: [true, "name is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message:
          '{VALUE} is not valid.Can only be one of the following: "male", "female", "others"',
      },
      required: true,
    }, //enum type
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "{} is not valid email type",
      },
    },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message:
          'the blood group can only be one of the following:"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"',
      },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianNameSchema,
      required: [true, "must needed"],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "must needed"],
    },
    profileImg: { type: String, default: "" },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
    },
    academicDepartMent: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartMent",
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },

    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } }
);
// mongoose virtual
studentSchema.virtual("fullName").get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

//query middleware
// studentSchema.pre("find", function (next) {
//   this.find({ isDeleted: { $ne: true } });

//   next();
// });
// studentSchema.pre("findOne", function (next) {
//   this.find({ isDeleted: { $ne: true } });

//   next();
// });
// studentSchema.pre("aggregate", function (next) {
//   // console.log(this.pipeline());
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });
// // CUSTOM INSTANCE METHOD
// // studentSchema.methods.isUserExist = async function (id: string) {
// //   const existingUser = await Student.findOne({ id });
// //   return existingUser;
// // };

// // CUSTOM STATIC METHOD
// studentSchema.statics.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

studentSchema.pre("save", async function (next) {
  const isEmailExist = await Student.findOne({ email: this.email });
  if (isEmailExist) {
    throw new AppError(httpStatus.CONFLICT, "this email Uses Another Student");
  }
  next();
});

studentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();

  const StudentInfo = await Student.findOne(query);
  if (!StudentInfo) {
    throw new AppError(httpStatus.NOT_FOUND, "id not founded");
  }
  if (StudentInfo && StudentInfo.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "this id already deleted");
  }
  next();
});

export const Student = model<TStudent, StudentModel>("student", studentSchema);
