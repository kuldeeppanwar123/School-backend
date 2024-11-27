import {getTeacherService, registerTeacherService, getAllTeacherOfAdminService, updateTeacherService, getTeachersService } from "../services/teacher.services.js";
import {matchPasswordService,hashPasswordService} from "../services/password.service.js";
import { error, success } from "../utills/responseWrapper.js";
import { getAccessTokenService, getRefreshTokenService } from "../services/JWTToken.service.js";
import { getSectionByTeacherId } from "../services/section.services.js";
import { getClassService } from "../services/class.sevices.js";
import { StatusCodes } from "http-status-codes";
import { convertToMongoId, isValidMongoId } from "../services/mongoose.services.js";
import { getEventService, updateEventService } from "../services/event.services.js";

export async function registerTeacherController(req, res) {
  try {
    const adminId = req.adminId;
    const { firstname, phone } = req.body;
    const teacher = await getTeacherService({ phone, isActive:true });
    if (teacher) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Phone number already registered"));
    }
    const password = firstname + "@" + phone;
    const hashedPassword = await hashPasswordService(password);
    req.body["password"] = hashedPassword;
    req.body["admin"] = adminId;
    const newTeacher = await registerTeacherService(req.body);
    return res.status(StatusCodes.CREATED).send(success(201, "Teacher registered successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function loginTeacherController(req, res) {
  try {
    const { user, password } = req.body;
    const teacher = await getTeacherService({$or: [{ username: user }, { phone: user }, { email: user }],isActive:true});
    if (!teacher) {
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Unauthorized email user"));
    }
    const matchPassword = await matchPasswordService({enteredPassword:password,storedPassword:teacher["password"]});
    if (!matchPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Unauthorized  user"));
    }
    const section = await getSectionByTeacherId(teacher["_id"]);
    if (!section) {
      return res.status(StatusCodes.BAD_REQUEST).send(error(400, "Teacher is not assigned to any section"));
    }
    const Class = await getClassService({ _id:section["classId"] });
    const accessToken = getAccessTokenService({
      role: "teacher",
      teacherId: teacher["_id"],
      adminId: teacher["admin"],
      phone: teacher["phone"],
      sectionId: section["_id"],
      classId: Class["_id"],
      sectionName: section["name"],
      className: Class["name"],
      email: teacher["email"]? teacher["email"]: "",
      pincode: teacher["pincode"]? teacher["pincode"]:"",
      username: teacher["username"]? teacher["username"]:""
    });
    const refreshToken = getRefreshTokenService({
      role: "teacher",
      teacherId: teacher["_id"],
      adminId: teacher["admin"],
      phone: teacher["phone"],
      sectionId: section["_id"],
      classId: Class["_id"],
      sectionName: section["name"],
      className: Class["name"],
      email: teacher["email"]? teacher["email"]: "",
      pincode: teacher["pincode"]? teacher["pincode"]:"",
      username: teacher["username"]? teacher["username"]:""
    });
    const isLoginAlready = teacher["isLoginAlready"];
    teacher["isLoginAlready"] = true;
    await teacher.save();
    return res.status(StatusCodes.OK).send(success(200, {accessToken, refreshToken, firstname: teacher["firstname"],isLoginAlready}));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function refreshAccessTokenController(req, res) {
  try {
    const data = req.data;
    const accessToken = getAccessTokenService(data);
    return res.status(StatusCodes.OK).send(success(200, { accessToken }));
  } catch (err) {
    res.send(error(500, err.message));
  }
}

export async function getAllTeacherOfAdminController(req, res) {
  try {
    const adminId = req.adminId;
    const teachers = await getAllTeacherOfAdminService(adminId);
    return res.status(StatusCodes.OK).send(success(200, teachers));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function updateTeacherController(req, res) {
  try {
    const teacherId = req.teacherId?req.teacherId:req.params.teacherId;
    const {username, firstname, lastname, dob, bloodGroup, email, gender, university, degree, password, phone, address, city, state, country, district, pincode, photo, method } = req.body;

    if(!isValidMongoId(teacherId)){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400,"Invalid teacher Id"));
    }
    const teacher = await getTeacherService({_id:teacherId, isActive:true});
    if (!teacher) {
      return res.status(StatusCodes.BAD_REQUEST).send(error(400, "Teacher doesn't exists"));
    }

    const fieldsToBeUpdated = {};
    if(email){
      const teacher = await getTeacherService({_id:{$ne:teacherId}, email, isActive:true});
      if(teacher){
        return res.status(StatusCodes.CONFLICT).send(error(409,"Email already registered"));
      }
      fieldsToBeUpdated.email = email;
    }

    if(username){
      const teacher = await getTeacherService({_id:{$ne:teacherId}, username, isActive:true});
      if(teacher){
        return res.status(StatusCodes.CONFLICT).send(error(409,"Username already registered"));
      }
      fieldsToBeUpdated.username = username;
    }

    if(phone){
      const teacher = await getTeacherService({_id:{$ne:teacherId}, phone, isActive:true});
      if(teacher){
        return res.status(StatusCodes.CONFLICT).send(error(409,"Phone already registered"));
      }
      fieldsToBeUpdated.phone = phone;
    }

    if(req.body["password"]){
      const hashedPassword = await hashPasswordService(req.body["password"]);
      fieldsToBeUpdated.password = hashedPassword;
    }

    if(firstname){ fieldsToBeUpdated.firstname = firstname; }
    if(lastname){ fieldsToBeUpdated.lastname = lastname; }
    if(dob){ fieldsToBeUpdated.dob = dob; }
    if(bloodGroup){ fieldsToBeUpdated.bloodGroup = bloodGroup; }
    if(gender){ fieldsToBeUpdated.gender = gender; }
    if(university){ fieldsToBeUpdated.university = university; }
    if(degree){ fieldsToBeUpdated.degree = degree; }
    if(address){ fieldsToBeUpdated["address"] = address; }
    if(city){ fieldsToBeUpdated["city"] = city; }
    if(district){ fieldsToBeUpdated["district"] = district; }
    if(state){ fieldsToBeUpdated["state"] = state; }
    if(country){ fieldsToBeUpdated["country"] = country; }
    if(pincode){ fieldsToBeUpdated["pincode"] = pincode; }
    if(photo || method==="DELETE"){ fieldsToBeUpdated.photo =(method==="DELETE")? "": photo; }


    await updateTeacherService({_id:teacherId}, fieldsToBeUpdated);
 
    return res.status(StatusCodes.OK).send(success(200, "Teacher updated successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function deleteTeacherController(req, res) {
  try {
    const teacherId = req.params.teacherId;
    if(!isValidMongoId(teacherId)){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400,"Invalid Teacher Id"));
    }

    const teacher = await getTeacherService({_id:teacherId, isActive:true});
    if(!teacher){
      return res.status(StatusCodes.NOT_FOUND).send(error(404,"Teacher not found"));
    }
    if (teacher["section"]) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Teacher is assigned to section. Can't delete teacher"));
    }
    await updateTeacherService({_id:teacher["_id"]}, {isActive:false})
    return res.status(StatusCodes.OK).send(success(200, "Teacher deleted successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function getTeacherController(req, res) {
  try {
    const id = req.params.teacherId?req.params.teacherId:req.teacherId;
    if(!isValidMongoId(id)){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400,"Invalid teacher Id"));
    }
    const teacher = await getTeacherService({_id:id, isActive:true});
    if(!teacher){
      return res.status(StatusCodes.NOT_FOUND).send(success(404,"Teacher not found"));
    }
    return res.status(StatusCodes.OK).send(success(200, teacher));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function getAllNonSectionTeacherController(req, res) {
  try {
    const adminId = req.adminId;
    const teachers = await getTeachersService({admin:adminId,section:null, isActive:true});
    return res.send(success(200, teachers));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}

export async function changePasswordTeacherController(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const teacherId = req.teacherId;
    const teacher = await getTeacherService({_id:teacherId, isActive:true});
    if (!teacher) {
      return res.status(StatusCodes.UNAUTHORIZED).send(error(401, "Unauthorized user"));
    }
    const isMatched = await matchPasswordService({enteredPassword:oldPassword,storedPassword:teacher["password"]});
    if (!isMatched){
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Wrong password"));
    }
    const hashedPassword = await hashPasswordService(newPassword);
    teacher["password"] = hashedPassword;
    await teacher.save();

    return res.status(StatusCodes.OK).send(success(200, "Password updated successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function forgetPasswordTeacherController(req, res) {
  try {
    const { otp, phone } = req.body;
    const teacher = await getTeacherService({phone})
    if(!teacher){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Teacher not found"))
    }
    const event = await getEventService({"sender.model": "teacher", "sender.id":teacher["_id"],status:"accept" })
    if(!event){
      return res.status(StatusCodes.UNAUTHORIZED).send(error(401, "Forget password request not raised"))
    }
    if(otp!==event["otp"]){
      return res.status(StatusCodes.BAD_GATEWAY).send(error(502, "OTP not matched"));
    }

    return res.status(StatusCodes.OK).send(success(200, {id: teacher["id"]}));    
    
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function forgetPasswordUpdateTeacherController(req, res){
  try {
    const{ id, password } = req.body;
    const teacher = await getTeacherService({_id:id, isActive:true})
    if(!teacher){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Teacher not found"));
    }
    const hashedPassword = await hashPasswordService(password)
    await updateTeacherService({_id: id, isActive:true}, {password:hashedPassword, forgetPasswordCount: teacher.forgetPasswordCount+1})
    const event =  await updateEventService({"sender.id": convertToMongoId(id), status :"accept"}, {status: "complete"});
    return res.status(StatusCodes.OK).send(success(200, "Password updated successfully")) 
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}
