/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import validateData from "../../middleware/validateData";

import { AcademicFacultySchemaValidations } from "./academicFaculty.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middleware/auth";

const routes = express.Router();

routes.post(
  "/create-academic-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateData(
    AcademicFacultySchemaValidations.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.createAcademicFaculty
);
routes.get("/", AcademicFacultyControllers.getAllAcademicFaculty);

routes.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);

routes.patch(
  "/:facultyId",
  validateData(
    AcademicFacultySchemaValidations.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyControllers.updateSingleAcademicFaculty
);
export const AcademicFacultyRoutes = routes;
