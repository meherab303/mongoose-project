/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { studentSchemaValidations } from "../student/student.zod.validation";
import validateData from "../../middleware/validateData";
import { facultyValidations } from "../faculty/faculty.validations";
import { AdminValidations } from "../admin/admin.validations";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import { userValidations } from "./user.validation";
import { upload } from "../utils/sendImageToCloudinary";

const routes = express.Router();

routes.post(
  "/create-student",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateData(studentSchemaValidations.createStudentZodSchemaValidation),
  UserController.createStudent
);
routes.post(
  "/create-faculty",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateData(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty
);
routes.post(
  "/create-admin",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateData(AdminValidations.createAdminValidationSchema),
  UserController.createAdmin
);

routes.post(
  "/change-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateData(userValidations.changeStatusValidationSchema),
  UserController.changeStatus
);

routes.get(
  "/getMe",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  UserController.getMe
);

export const UserRoutes = routes;
