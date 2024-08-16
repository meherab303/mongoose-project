/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { facultyValidations } from "./faculty.validations";
import { FacultyControllers } from "./faculty.controller";
import validateData from "../../middleware/validateData";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  FacultyControllers.getSingleFaculty
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateData(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),

  FacultyControllers.deleteFaculty
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  FacultyControllers.getAllFaculties
);

export const FacultyRoutes = router;
