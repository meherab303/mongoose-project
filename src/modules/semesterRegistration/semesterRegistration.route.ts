/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import validateData from "../../middleware/validateData";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/create-semester-registration",
  auth("admin"),
  validateData(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  "/:id",
  SemesterRegistrationController.getSingleSemesterRegistration
);
router.get(
  "/",
  auth("student", "faculty", "admin"),
  SemesterRegistrationController.getAllSemesterRegistrations
);

router.patch(
  "/:id",
  auth("admin"),

  validateData(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.updateSemesterRegistration
);

router.delete(
  "/:id",
  auth("admin"),
  SemesterRegistrationController.deleteSemesterRegistration
);

export const semesterRegistrationRoutes = router;
