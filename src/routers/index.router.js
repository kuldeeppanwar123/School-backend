import express from "express";
import adminRouter from "./admin.router.js";
import parentRouter from "./parent.router.js";
import studentRouter from "./student.router.js";
import teacherRouter from "./teacher.router.js";
import sectionRouter from "./section.router.js";
import attendanceRouter from "./attendance.router.js";
import holidayEventRouter from "./holidayEvent.router.js";
import classRouter from "./class.router.js";
import adminDashboardRouter from "./dashBoardAdmin.router.js";
import parentDashboardRouter from "./dashBoardParent.router.js";
import teacherDashboardRouter from "./dashBoardTeacher.router.js";
import eventRouter from "./event.router.js";
import superAdminRouter from "./superAdmin.router.js";
import leaveRouter from "./leave.router.js";
import guestTeacherRouter from './guestTeacher.router.js'
const router = express();

router.use("/admin", adminRouter);
router.use("/parent", parentRouter);
router.use("/teacher", teacherRouter);
router.use("/student", studentRouter);
router.use("/class", classRouter);
router.use("/leave", leaveRouter);
router.use("/section", sectionRouter);
router.use("/event", eventRouter);
router.use("/attendance", attendanceRouter);
router.use("/holiday-event", holidayEventRouter);
router.use("/admin-dashboard",adminDashboardRouter);
router.use("/parent-dashboard",parentDashboardRouter);
router.use("/teacher-dashboard",teacherDashboardRouter);
router.use('/super-admin', superAdminRouter);
router.use('/guest-teacher', guestTeacherRouter)

export default router;