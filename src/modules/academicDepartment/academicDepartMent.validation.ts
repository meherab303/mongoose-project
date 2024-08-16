import { z } from "zod";
const createAcademicDepartMentValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    academicFaculty: z.string(),
  }),
});

const updateAcademicDepartMentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Academic departMent must be string",
        required_error: "Academic DepartMent Name is required",
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: "Academic faculty must be string",
        required_error: "Academic faculty is required",
      })
      .optional(),
  }),
});

export const AcademicDepartMentSchemaValidations = {
  createAcademicDepartMentValidationSchema,
  updateAcademicDepartMentValidationSchema,
};
