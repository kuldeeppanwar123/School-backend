import { StatusCodes } from "http-status-codes";
import { error, success } from "../utills/responseWrapper.js";
import { getGuestTeacherService } from "../services/guestTeacher.service.js";
import { getSectionService } from "../services/section.services.js";
import { matchPasswordService } from "../services/password.service.js";
import { getClassService } from "../services/class.sevices.js";
import { getAccessTokenService, getRefreshTokenService } from "../services/JWTToken.service.js";


export async function loginGuestTeacherController(req, res) {
  try {
    const { username, password } = req.body;
    const guestTeacher = await getGuestTeacherService({username})
     if (!guestTeacher) {
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Unauthorized  username"));
    }
    const matchPassword = await matchPasswordService({enteredPassword:password,storedPassword:guestTeacher["password"]});
    if (!matchPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Unauthorized  user"));
    }
    const section = await getSectionService({_id: guestTeacher["section"]});
    if (!section) {
      return res.status(StatusCodes.BAD_REQUEST).send(error(400, "section not found"));
    }
    const Class = await getClassService({ _id:section["classId"] });
    const accessToken = getAccessTokenService({
      role: "guestTeacher",
      guestTeacherId: guestTeacher["_id"],
      adminId: guestTeacher["admin"],
      sectionId: section["_id"],
      classId: Class["_id"],
      sectionName: section["name"],
      className: Class["name"],
      username: guestTeacher["username"]
    });
    const refreshToken = getRefreshTokenService({
      role: "guestTeacher",
      guestTeacherId: guestTeacher["_id"],
      adminId: guestTeacher["admin"],
      sectionId: section["_id"],
      classId: Class["_id"],
      sectionName: section["name"],
      className: Class["name"],
      username: guestTeacher["username"]
    });
    return res.status(StatusCodes.OK).send(success(200, {accessToken, refreshToken, username: guestTeacher["username"]}));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}
