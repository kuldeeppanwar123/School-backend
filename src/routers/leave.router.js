import { registerLeaveRequestValidation, updateTeacherLeaveRequestValidation } from "../middlewares/validation/leave.validation.middleware.js";
import { getLeaveRequestsController, registerLeaveRequestController, updateTeacherLeavRequestController } from "../controllers/leave.controller.js";
import { teacherAuthenticate } from "../middlewares/authentication/teacher.authentication.middleware.js";
import express from "express";
import { adminAuthenticate } from "../middlewares/authentication/admin.authentication.middleware.js";

const leaveRouter = express.Router();

leaveRouter.get("/admin", adminAuthenticate, getLeaveRequestsController)
leaveRouter.post("/teacher", registerLeaveRequestValidation, teacherAuthenticate, registerLeaveRequestController)
leaveRouter.put("/admin", adminAuthenticate, updateTeacherLeaveRequestValidation, updateTeacherLeavRequestController )

export default leaveRouter;
