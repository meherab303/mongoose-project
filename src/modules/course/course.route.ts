/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { CourseValidations } from "./course.validation";
import { CourseControllers } from "./course.controller";
import validateData from "../../middleware/validateData";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create-course",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  validateData(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse
);
router.get(
  "/",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  CourseControllers.getAllCourses
);

router.get(
  "/:id",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  CourseControllers.getSingleCourse
);
router.patch(
  "/:id",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  validateData(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse
);

router.delete(
  "/:id",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  CourseControllers.deleteCourse
);
router.put(
  "/:courseId/assign-faculties",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),
  validateData(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse
);
router.get(
  "/:courseId/get-faculties",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),

  CourseControllers.getFacultiesWithCourse
);
router.delete(
  "/:courseId/remove-faculties",
  auth(
    USER_ROLE.admin,

    USER_ROLE.superAdmin
  ),

  validateData(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse
);
export const CourseRoutes = router;
