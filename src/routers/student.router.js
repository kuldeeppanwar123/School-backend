import express from "express";
import {  deleteStudentController, getStudentsController, registerStudentController, registerStudentsFromExcelController, updateStudentController } from "../controllers/student.controller.js";
import { adminAuthenticate } from "../middlewares/authentication/admin.authentication.middleware.js";
import { teacherAuthenticate } from "../middlewares/authentication/teacher.authentication.middleware.js";
import { parentAuthenticate } from "../middlewares/authentication/parent.authentication.middleware.js";
import {deleteStudentValidation, getStudentValidation, registerStudentValidation, updateStudentByAdminValidation, updateStudentByParentValidation, updateStudentByTeacherValidation, updateStudentParentByAdminValidation, uploadStudentPhotoValidation } from "../middlewares/validation/student.validation.middleware.js";
import { validateImageSizeMiddleware } from "../middlewares/teacher.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const studentRouter = express.Router();


studentRouter.post("/teacher", teacherAuthenticate, registerStudentValidation, registerStudentController );
studentRouter.post("/admin", adminAuthenticate, registerStudentValidation, registerStudentController );
studentRouter.post('/excel', adminAuthenticate, upload, registerStudentsFromExcelController);

studentRouter.delete("/teacher/:studentId", teacherAuthenticate, deleteStudentValidation, deleteStudentController );
studentRouter.delete("/admin/:studentId", adminAuthenticate, deleteStudentValidation, deleteStudentController );

studentRouter.get("/teacher", teacherAuthenticate, getStudentValidation, getStudentsController );
studentRouter.get("/admin", adminAuthenticate, getStudentValidation, getStudentsController );
studentRouter.get("/parent", adminAuthenticate, getStudentValidation, getStudentsController );

studentRouter.put("/teacher/:studentId", teacherAuthenticate, updateStudentByTeacherValidation, updateStudentController );
studentRouter.put("/admin/:studentId", adminAuthenticate, updateStudentParentByAdminValidation, updateStudentController );
studentRouter.put("/parent/:studentId", parentAuthenticate, updateStudentByParentValidation, updateStudentController );


studentRouter.put("/teacher/photo-upload/:studentId", teacherAuthenticate, uploadStudentPhotoValidation, validateImageSizeMiddleware, updateStudentController)
studentRouter.put("/parent/photo-upload/:studentId", parentAuthenticate, uploadStudentPhotoValidation, validateImageSizeMiddleware, updateStudentController)
  
export default studentRouter;