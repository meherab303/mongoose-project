/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import validateData from "../../middleware/validateData";

import { AcademicDepartMentSchemaValidations } from "./academicDepartMent.validation";

import { AcademicDepartMentControllers } from "./academicDepartMent.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const routes = express.Router();

routes.post(
  "/create-academic-department",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateData(
    AcademicDepartMentSchemaValidations.createAcademicDepartMentValidationSchema
  ),
  AcademicDepartMentControllers.createAcademicDepartMent
);
routes.get("/", AcademicDepartMentControllers.getAllAcademicDepartMent);

routes.get(
  "/:departMentId",
  AcademicDepartMentControllers.getSingleAcademicDepartment
);

routes.patch(
  "/:departMentId",
  validateData(
    AcademicDepartMentSchemaValidations.updateAcademicDepartMentValidationSchema
  ),
  AcademicDepartMentControllers.updateSingleAcademicDepartment
);
export const AcademicDepartMentRoutes = routes;
