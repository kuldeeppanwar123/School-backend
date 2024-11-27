import express from 'express';
import { adminAuthenticate } from '../middlewares/authentication/admin.authentication.middleware.js';
import { createHolidayEventValidation, getHolidayEventValidation, updateHolidayEventValidation } from '../middlewares/validation/holidayEvent.validation.middleware.js';
import { createHolidayEventController, deleteHolidayEventController, getHolidayEventController, updateHolidayEventController } from '../controllers/holidayEvent.controller.js';
import { teacherAuthenticate } from '../middlewares/authentication/teacher.authentication.middleware.js';

const holidayEventRouter = express.Router();

holidayEventRouter.post("/register", adminAuthenticate, createHolidayEventValidation,createHolidayEventController);
holidayEventRouter.post("/", adminAuthenticate, getHolidayEventValidation, getHolidayEventController);
holidayEventRouter.post("/teacher", teacherAuthenticate, getHolidayEventValidation, getHolidayEventController);
holidayEventRouter.put("/:eventId", adminAuthenticate, updateHolidayEventValidation, updateHolidayEventController);
holidayEventRouter.delete("/:eventId", adminAuthenticate, deleteHolidayEventController);
 
export default holidayEventRouter;