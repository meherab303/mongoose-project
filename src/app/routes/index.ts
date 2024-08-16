import { Router } from "express";
import { StudentRoutes } from "../../modules/student/student.route";
import { UserRoutes } from "../../modules/user/user.router";
import { AcademicSemesterRoutes } from "../../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartMentRoutes } from "../../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../../modules/faculty/faculty.route";
import { AdminRoutes } from "../../modules/admin/admin.route";
import { CourseRoutes } from "../../modules/course/course.route";
import { semesterRegistrationRoutes } from "../../modules/semesterRegistration/semesterRegistration.route";
import { offeredCourseRoutes } from "../../modules/offeredCourse/offeredCourse.route";
import { AuthRoutes } from "../../modules/auth/auth.route";
import { EnrolledCourseRoutes } from "../../modules/enrolledCourse/enrolledCourse.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/students",
    route: StudentRoutes,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/academic-semester",
    route: AcademicSemesterRoutes,
  },
  {
    path: "/academic-faculty",
    route: AcademicFacultyRoutes,
  },
  {
    path: "/academic-department",
    route: AcademicDepartMentRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/semester-registrations",
    route: semesterRegistrationRoutes,
  },
  {
    path: "/offered-courses",
    route: offeredCourseRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/enrolledCourse",
    route: EnrolledCourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
