import express from "express";
import { teacherAuthenticate } from "../middlewares/authentication/teacher.authentication.middleware.js";
import { checkAttendaceMarkedController, getMisMatchAttendanceController, checkParentAttendaceMarkedController, updateAttendanceController, attendanceStatusOfSectionController, attendanceCountOfStudentController, attendanceByTeacherController, attendanceByParentController, attendanceStatusOfStudentController } from "../controllers/attendance.controller.js";
import { parentAuthenticate } from "../middlewares/authentication/parent.authentication.middleware.js";
import { attendanceByParentValidation, attendanceByTeacherValidation, attendanceCountValidation, attendanceStatusValidation, updateAttendanceValidation } from "../middlewares/validation/attendance.validation.middleware.js";
 
const attendanceRouter = express.Router();  

attendanceRouter.post("/teacher", teacherAuthenticate, attendanceByTeacherValidation, attendanceByTeacherController);
attendanceRouter.post("/parent", parentAuthenticate, attendanceByParentValidation, attendanceByParentController);
attendanceRouter.put("/teacher", teacherAuthenticate, updateAttendanceValidation, updateAttendanceController);
attendanceRouter.get("/mismatch", teacherAuthenticate, getMisMatchAttendanceController);
attendanceRouter.get("/teacher/is-marked", teacherAuthenticate, checkAttendaceMarkedController);
attendanceRouter.get("/parent/is-marked/:studentId", parentAuthenticate, checkParentAttendaceMarkedController);
attendanceRouter.post("/status", teacherAuthenticate, attendanceStatusValidation, attendanceStatusOfSectionController);
attendanceRouter.post("/status/:studentId", parentAuthenticate, attendanceStatusValidation, attendanceStatusOfStudentController);
attendanceRouter.post("/parent/count", parentAuthenticate, attendanceCountValidation, attendanceCountOfStudentController)
attendanceRouter.post("/teacher/count", teacherAuthenticate, attendanceCountValidation, attendanceCountOfStudentController)



export default attendanceRouter    