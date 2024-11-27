import { createSectionAttendanceService, getSectionAttendanceService, getSectionAttendancesService, getSectionAttendanceStatusService } from "../services/sectionAttendance.services.js";
import {createAttendanceService,getAttendanceService, getAttendancesService, updateAttendanceService, getMisMatchAttendanceService} from "../services/attendance.service.js";
import {getStudentService} from "../services/student.service.js";
import { error, success } from "../utills/responseWrapper.js";
import { StatusCodes } from "http-status-codes";
import { getSectionByIdService, getSectionService } from "../services/section.services.js";
import { getTeacherService } from "../services/teacher.services.js";
import { getDayNameService, getStartAndEndTimeService } from "../services/celender.service.js";
import { getHolidayEventService } from "../services/holidayEvent.service.js";

export async function attendanceByTeacherController(req, res) { 
  try {
    const {sectionId, present, absent} = req.body;
    const teacherId = req.teacherId;
    const adminId = req.adminId;
    const section = await getSectionService({ _id: sectionId })
    if(!section){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Section not found"))
    }

    if(section["guestTeacher"] && section["guestTeacher"].toString()!==teacherId){
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Teacher is unauthorized"))
    }
    let date = new Date();
    const { startTime, endTime } = getStartAndEndTimeService(date, date);

    if(present.length==0 && absent.length==0){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400,"No student provided"));
    }
    
    const day = getDayNameService(date.getDay());
    date = date.getTime();
    if (day === "Sunday") {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is sunday"));
    }

    const holiday = await getHolidayEventService({date:{$gte:startTime,$lte:endTime}, admin:adminId, holiday:true});
    if (holiday) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is scheduled as holiday!"));
    }
    const sectionAttendance = await getSectionAttendanceService({section:sectionId, date:{$gte:startTime,$lte:endTime}})
    if(sectionAttendance){
      return res.status(StatusCodes.CONFLICT).send(error(409, "Attendance already marked"));
    }

    present.map(async (student) => {
      const paramObj = {"student":student["_id"], date:{$gte:startTime, $lte:endTime}, parentAttendance: {$ne:""}};
      const parentMarkedAttendance = await getAttendanceService(paramObj);

      if(parentMarkedAttendance){
        const id = parentMarkedAttendance["_id"];
        const fieldsToBeUpdated = {teacherAttendance:"present", section:sectionId, teacher:teacherId, admin:adminId};
        await updateAttendanceService({id, fieldsToBeUpdated});
      }else{
        const attendanceObj = {date, day, student:student["_id"], teacherAttendance:"present", section:sectionId, teacher:teacherId, admin:adminId};
        await createAttendanceService(attendanceObj);
      }
    });

    absent.map(async (student) => {
      const paramObj = {student:student["_id"], date:{$gte:startTime, $lte:endTime}, parentAttendance: {$ne:""}};
      const parentMarkedAttendance = await getAttendanceService(paramObj);

      if(parentMarkedAttendance){
        const id = parentMarkedAttendance["_id"];
        const fieldsToBeUpdated = {teacherAttendance:"present", section:sectionId, teacher:teacherId, admin:adminId};
        await updateAttendanceService({id, fieldsToBeUpdated});
      }else{
        const attendanceObj = {date, day, student:student["_id"], teacherAttendance:"absent", section:sectionId, teacher:teacherId, admin:adminId};
        await createAttendanceService(attendanceObj);
      }
    });

    const presentCount = present?.length;
    const absentCount = absent?.length;
    await createSectionAttendanceService({date, section:sectionId, teacher:teacherId, presentCount, absentCount, status:"completed"});
    return res.status(StatusCodes.OK).send(success(200, "Attendance marked successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function attendanceByParentController(req, res) {
  try {
    const { studentId, attendance} = req.body;
    const parentId = req.parentId;
    const adminId = req.adminId;
    let date = new Date();
    const{startTime, endTime} = getStartAndEndTimeService(date, date);    
    
    if(!(attendance==="present" || attendance==="absent")){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400,"Invalid attendance value"));
    }

    const student = await getStudentService({_id:studentId, isActive:true});
    if(!student){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "student not found"));
    }
    if((student["parent"].toString())!==parentId){
      return res.status(StatusCodes.UNAUTHORIZED).send(error(401, "Parent is not authorized to mark attendance."));
    }
    
    const day = getDayNameService(date.getDay());
    date = date.getTime();
    
    if (day === "Sunday"){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400, "Today is sunday"));
    }

    const [attendanceMarkedByTeacher, attendanceMarkedByParent, holidayEvent] = await Promise.all([
      getAttendanceService({student:studentId, date:{$gte:startTime,$lte:endTime}, teacherAttendance:{$ne:""}}),
      getAttendanceService({student:studentId, date: {$gte:startTime,$lte:endTime},parentAttendance:{$ne:""}}),
      getHolidayEventService({date: {$gte:startTime,$lte:endTime}, admin:adminId, holiday: true})
    ]) ;

    if (holidayEvent) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is scheduled as holiday!"));
    }

    if(attendanceMarkedByTeacher){
      return res.status(StatusCodes.CONFLICT).send(error(409, "Parent can't mark attendance,teacher already marked."));
    }

    if(attendanceMarkedByParent){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400,"Attendance already marked by parent"));
    }

    const markAttendance = await createAttendanceService({student:studentId,date,day,parentAttendance:attendance});
    if(markAttendance instanceof Error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(400,"Parent is unable to mark attendance"));
    }
    return res.status(StatusCodes.OK).send(success(200, "Attendance marked sucessfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function getMisMatchAttendanceController(req,res){
  try {
    const sectionId = req.sectionId;
    let date = new Date();
    const{startTime, endTime} = getStartAndEndTimeService(date, date);
    const day = getDayNameService(date.getDay());
    date = date.getTime();
    if (day === "Sunday") {
      return res.status(StatusCodes.CONFLICT).send(error(400, "Today is sunday"));
    }
 
    const attendances = await getMisMatchAttendanceService({section:sectionId,startTime,endTime});
    return res.status(StatusCodes.OK).send(success(200,{attendances}));    
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500,err.message));
  }
}

export async function updateAttendanceController(req,res){
  try {
    const{present,absent} = req.body;
    const teacherId = req.teacherId;
    const teacher = await getTeacherService({_id:teacherId, isActive:true});
    const sectionId = teacher["section"];

    const date = new Date();
    const {startTime, endTime} = getStartAndEndTimeService(date, date);

    const presentLength = present?.length;
    for(let i=0;i<presentLength; i++){
      const id = present[i]["_id"];
      const fieldsToBeUpdated = {teacherAttendance:"present"}
      await updateAttendanceService({id, fieldsToBeUpdated});
    }
    
    const absentLength = absent?.length;
    for(let i=0;i<absentLength; i++){
      const id = absent[i]["_id"];
      const fieldsToBeUpdated = {teacherAttendance:"absent"}
      await updateAttendanceService({id, fieldsToBeUpdated});
    }


    const sectionAttendance = await getSectionAttendanceService({section:sectionId, date:{$gte: startTime, $lte: endTime}});
    sectionAttendance["presentCount"] = sectionAttendance["presentCount"]-absentLength+presentLength;
    sectionAttendance["absentCount"] = sectionAttendance["absentCount"]-presentLength+absentLength;
    await sectionAttendance.save();
    return res.send(success(200,"Attendance updated successfully"))
  } catch (err) {
    return res.send(error(500,err.message)) ;   
  }
}

export async function checkAttendaceMarkedController(req, res) {
  try {
    const adminId = req.adminId;
    const sectionId = (req.sectionId)?(req.sectionId):(req.params.sectionId);
    if(!sectionId){
      return res.status(StatusCodes.BAD_GATEWAY).send(error(502, "Section id is required."));
    }
    const date = new Date();
    const {startTime, endTime} = getStartAndEndTimeService(date, date);

    const holiday = await getHolidayEventService({date:{$gte:startTime,$lte:endTime}, admin:adminId, holiday:true});
    if (holiday) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is scheduled as holiday!"));
    }
    const day = getDayNameService(date.getDay());
    date = date.getTime();
    if (day === "Sunday") {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is sunday"));
    }

    const sectionAttendance = await getSectionAttendanceService({section:sectionId, date:{$gte:startTime, $lte:endTime}});

    if (sectionAttendance) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Attendance already marked"));
    }
    return res.status(StatusCodes.OK).send(success(200, "Attendance haven't marked today"));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}

export async function checkParentAttendaceMarkedController(req, res) {
  try {
    const studentId = req.params.studentId;
    const parentId = req.parentId;
    const adminId = req.adminId;
    const date = new Date();
    const{startTime, endTime} = getStartAndEndTimeService(date, date);
 
    const holidayEvent = await getHolidayEventService({ admin:adminId,date:{$gte:startTime, $lte:endTime}});
    if (holidayEvent) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is scheduled as holiday!"));
    }

    const day = getDayNameService(date.getDay());
    if (day === "Sunday") {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Today is sunday"));
    }

    const attendance = await getAttendanceService({student:studentId, date:{$gte:startTime, $lte:endTime}, parentAttendance:{$ne:""}});
    const parentAttendance = attendance?attendance["parentAttendance"]:null;
    const teacherAttendance = attendance?attendance["teacherAttendance"]:null;

    return res.send(success(200, {parentAttendance,teacherAttendance}));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}

export async function attendanceStatusOfSectionController(req, res) {
  try {
    const sectionId = req.sectionId;
    const {startTime, endTime} = req.body;
 
    const section = await getSectionByIdService(sectionId);
    const totalStudent = section["studentCount"];
    const sectionAttendance = await getSectionAttendanceStatusService({date:{$gte: startTime, $lte: endTime}, section:sectionId})

    return res.status(StatusCodes.OK).send(success(200, {section:sectionId, totalStudent, sectionAttendance}));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function attendanceStatusOfStudentController(req, res) {
  try {
    const studentId = req.params.studentId;
    let {startTime, endTime} = req.body;

    const student = await getStudentService({_id:studentId, isActive:true});
    if(!student){
      return res.error(StatusCodes.NOT_FOUND).send(error(404,"Student not found"));
    }
    const attendance = await getAttendancesService({student:studentId, date:{$gte:startTime, $lte:endTime}});
    return res.status(StatusCodes.OK).send(success(200, {attendance}));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function attendanceCountOfStudentController(req, res){
  try { 
    let{studentId, startTime, endTime} = req.body; 

    const student = await getStudentService({_id:studentId});
    if(!student){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Student not found"));
    }

    const [studentAttendance, sectionAttendance] = await Promise.all([
      getAttendancesService({student:studentId, teacherAttendance:"present", date:{$gte: startTime, $lte:endTime}}),
      getSectionAttendancesService({section:student["section"], date:{$gte:startTime, $lte:endTime}})
    ]);

    const studentAttendanceCount = studentAttendance.length;
    const sectionAttendanceCount = sectionAttendance.length;
  
    return res.status(StatusCodes.OK).send(success(200,{studentAttendanceCount, sectionAttendanceCount}));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}
