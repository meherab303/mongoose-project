/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { AcademicSemesterController } from "./academicSemester.controller";
import validateData from "../../middleware/validateData";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const routes = express.Router();
routes.post(
  "/create-academic-semester",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  validateData(
    AcademicSemesterValidations.createAcademicSemesterSchemaValidation
  ),
  AcademicSemesterController.createAcademicSemester
);
routes.get(
  "/",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  AcademicSemesterController.getAllAcademicSemester
);

routes.get(
  "/:semesterId",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  AcademicSemesterController.getSingleAcademicSemester
);

routes.patch(
  "/:semesterId",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  validateData(
    AcademicSemesterValidations.updateAcademicSemesterSchemaValidation
  ),
  AcademicSemesterController.updateSingleAcademicSemester
);

export const AcademicSemesterRoutes = routes;
