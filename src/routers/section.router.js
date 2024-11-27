import express from "express";
import {deleteSectionController,getSectionController,registerSectionController, replaceTeacherController,} from "../controllers/section.controller.js";
import { adminAuthenticate } from "../middlewares/authentication/admin.authentication.middleware.js";
import { registerSectionValidation } from "../middlewares/validation/section.validation.middleware.js";

const sectionRouter = express.Router();

sectionRouter.post("/", adminAuthenticate, registerSectionValidation, registerSectionController);
sectionRouter.put("/replace-teacher",adminAuthenticate,replaceTeacherController);
sectionRouter.put("/guest-teacher",adminAuthenticate,replaceTeacherController);
sectionRouter.get("/:sectionId", adminAuthenticate, getSectionController);
sectionRouter.delete("/:sectionId", adminAuthenticate, deleteSectionController);

export default sectionRouter; 