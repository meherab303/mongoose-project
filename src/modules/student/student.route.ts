/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { StudentController } from "./student.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const routes = express.Router();

routes.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getAllStudent
);
routes.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getSingleStudent
);
routes.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.updateStudent
);

routes.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.deleteSingleStudent
);

export const StudentRoutes = routes;
