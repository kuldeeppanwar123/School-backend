import { StatusCodes } from "http-status-codes";
import { getClassService, updateClassService } from "../services/class.sevices.js";
import {deleteSection,
  
  deleteSectionService,
  
  getAllSection,getClassSections, getSectionService, registerSectionService, updateSectionService} from "../services/section.services.js";
import { getTeacherService, updateTeacherService } from "../services/teacher.services.js";
import { error, success } from "../utills/responseWrapper.js";

export async function registerSectionController(req, res) {
  try {
    const { name, teacherId, classId } = req.body;
    const adminId = req.adminId;
    const classInfo = await getClassService({ _id:classId });
    if (!classInfo) {
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Class not found"));
    }
    let section = await getSectionService({name, classId, admin:adminId});
    if (section) {
      return res.status(StatusCodes.CONFLICT).send(error(409, "Section already exists"));
    }
    section = await registerSectionService({name, teacher:teacherId, classId, admin:adminId});
    const teacher = await getTeacherService({_id:teacherId, isActive:true});
    if (!teacher) {
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Teacher not found"));
    }
    if(teacher["section"]){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400, "Teacher already assigned to section"));
    }
    teacher.section = section["_id"];
    teacher.isClassTeacher = true;
    await teacher.save();
    classInfo["section"]?.push(section["_id"]);
    await classInfo.save();
    return res.status(StatusCodes.OK).send(success(201, "Section created successfully!"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function getSectionController(req,res){
  try {
    const _id = req.params.sectionId;
    const[section, teacher] = await Promise.all([ getSectionService({ _id }), getTeacherService({ section:_id }, { firstname:1, lastname:1 }) ]);
    if(!section){
      return res.status(StatusCodes.NOT_FOUND).send(error(400,"Section not found."));
    }
    return res.status(StatusCodes.OK).send(success(200,{section, teacher}));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function deleteSectionController(req, res) {
  try {
    const sectionId = req.params.sectionId;
    const adminId = req.adminId;
    let section = await getSectionService({_id:sectionId});
    if(!section){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Section not found"));
    }
    if(section["studentCount"] > 0){
      return res.status(StatusCodes.BAD_REQUEST).send(error(400, "section contains students"));
    }
    const[sectionInfo, classInfo, teacher] = await Promise.all([
      deleteSectionService({ _id:sectionId }), 
      updateClassService({_id:section["classId"]}, {$pull:{section:sectionId}}),
      updateTeacherService({_id:section["teacher"]}, {section:null}) 
    ])
    
    return res.send(success(200, "section deleted successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function getAllSectionsController(req, res) {
  try {
    const sectionlist = await getAllSection();
    return res.send(success(200, sectionlist));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function replaceTeacherController(req, res) {
  try {
    const adminId = req.adminId;
    const { sectionId, teacherId } = req.body;
    const section = await getSectionService({_id:sectionId});
    if(!section) {
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Section doesn't exists"));
    }
    const[prevTeacher, teacher] = await Promise.all([
      getTeacherService({_id:section["teacher"]}),
      getTeacherService({_id:teacherId})
    ])
    if(!teacher) {
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Teacher doesn't exists"));
    }
    if(teacher["section"]){
      return res.status(StatusCodes.BAD_REQUEST).send(error(409, "Teacher already occupied"));
    }
    

    section["teacher"] = teacherId;
    teacher["section"] = sectionId;
    prevTeacher["section"] = null;

    await Promise.all([
      section.save(),
      teacher.save(),
      prevTeacher.save()
    ])
    return res.status(StatusCodes.OK).send(success(200, "Teacher changed successfully"));
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}

export async function assignGuestTeacherController(req, res){
  try {
    const { guestTeacherId, sectionId, teacherId } = req.body;
    const adminId = req.adminId;
    const [teacher, guestTeacher, section, guestTeacherSection] = await Promise.all([
      getTeacherService({_id,teacherId, admin:adminId, isActive:true}),    
      getTeacherService({_id,teacherId, admin:adminId, isActive:true}),
      getSectionService({_id:sectionId}),    
      getSectionService({guestTeacher:guestTeacherId}),    
    ]);
    if(!teacher){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Teacher not found."))
    }
    if(!guestTeacher){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Guest Teacher not found."))
    }
    if(!guestTeacherSection){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Guest Teacher already assigned to as guest."))
    }
    if(!section){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Section not found."))
    }
    if((section["teacher"].toString())!==teacherId){
      return res.status(StatusCodes.NOT_FOUND).send(error(404, "Section Teacher mismatch."))
    }

    await updateSectionService({_id: sectionId}, {guestTeacher: guestTeacherId})

    return res.status(StatusCodes.OK).send(error(404, "Section not found."))

        
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}
