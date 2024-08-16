import { z } from "zod";

// Define the schemas for each sub-document
const studentNameZodSchemaValidation = z.object({
  firstName: z
    .string()
    .trim()
    .max(10, "firstName cannot be more than 10 characters"),
  //   .refine(
  //     (value) => {
  //       const firstNameFormat =
  //         value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  //       return value === firstNameFormat;
  //     },
  //     {
  //       message: (value:string) => `${value} is not in capitalize format`,
  //     }
  //   ),
  middleName: z
    .string()
    .trim()

    .max(10, "middlename cannot be more than 10 characters")
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(10, "lastname cannot be more than 10 characters"),
  // .refine((value) => /^[a-zA-Z]+$/.test(value), {
  //   message: "lastname can contain only letters",
  // }),
});

const guardianZodSchemaValidation = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianZodSchemaValidation = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Define the main student schema
const createStudentZodSchemaValidation = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: studentNameZodSchemaValidation,
      gender: z.enum(["male", "female", "others"]),
      dateOfBirth: z.string().optional(),
      email: z.string().email("Email is not valid"),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianZodSchemaValidation,
      localGuardian: localGuardianZodSchemaValidation,

      admissionSemester: z.string(),
      academicDepartMent: z.string(),

      isDeleted: z.boolean().default(false),
    }),
  }),
});

const updateStudentNameZodSchemaValidation = z.object({
  firstName: z
    .string()
    .trim()
    .max(10, "firstname cannot be more than 10 characters")
    .optional(),
  middleName: z
    .string()
    .trim()
    .max(10, "middlename cannot be more than 10 characters")
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(10, "lastname cannot be more than 10 characters")
    .optional(),
});
const updateGuardianZodSchemaValidation = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianZodSchemaValidation = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentZodSchemaValidation = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: updateStudentNameZodSchemaValidation.optional(),
      gender: z.enum(["male", "female", "others"]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email("Email is not valid").optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianZodSchemaValidation.optional(),
      localGuardian: updateLocalGuardianZodSchemaValidation.optional(),

      admissionSemester: z.string().optional(),
      academicDepartMent: z.string().optional(),
      isDeleted: z.boolean().default(false).optional(),
    }),
  }),
});

export const studentSchemaValidations = {
  createStudentZodSchemaValidation,
  updateStudentZodSchemaValidation,
};
