import { Request, Response } from "express";
import { StudentService } from "./student.service";

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    const result = await StudentService.createStudentIntoDb(studentData);

    res.status(200).json({
      success: true,
      message: "student is created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentFromDb();

    res.status(200).json({
      success: true,
      message: "students is retrieve successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentFromDb(studentId);

    res.status(200).json({
      success: true,
      message: "student is retrieve successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
};
