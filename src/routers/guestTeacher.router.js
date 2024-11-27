import express from 'express';
import { loginGuestTeacherController } from "../controllers/guestTeacher.controller.js";
import { loginGuestTeacherValidation } from "../middlewares/validation/guestTeacher.validation.middleware.js";

const guestTeacherRouter = express.Router();

guestTeacherRouter.post("/login", loginGuestTeacherValidation, loginGuestTeacherController)

export default guestTeacherRouter;
