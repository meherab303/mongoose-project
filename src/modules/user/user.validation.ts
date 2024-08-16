import { z } from "zod";
import { userStatus } from "./user.constant";

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: "password must be string" })
    .min(1, { message: "Password is required" })
    .max(20, { message: "can not be more than 20 characters" })
    .optional(),
});
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...userStatus] as [string, ...string[]]),
  }),
});

export const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
