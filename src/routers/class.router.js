import express from 'express';
import { deleteClassController, getClassController, getClassListController, registerClassController } from '../controllers/class.controller.js';
import { adminAuthenticate } from '../middlewares/authentication/admin.authentication.middleware.js';
import { classRegisterValidation } from '../middlewares/validation/class.validation.middleware.js';

const classRouter = express.Router();

classRouter.post("/",adminAuthenticate, classRegisterValidation, registerClassController);
classRouter.get("/:classId",adminAuthenticate,getClassController);
classRouter.delete("/:classId",adminAuthenticate, deleteClassController);
classRouter.get("/all",adminAuthenticate,getClassListController);

export default classRouter; 