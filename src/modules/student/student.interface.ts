import { Model, Types } from "mongoose";

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};
export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  // password: string;
  name: TName;
  gender: "male" | "female" | "others";
  dateOfBirth?: string;
  email: string;
  emergencyContactNo: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartMent: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
};

// CUSTOM INSTANCE METHOD INTERFACE
// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>;
// };
// export type StudentModel = Model<TStudent, {}, StudentMethods>;

//STATIC METHOD
export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}
