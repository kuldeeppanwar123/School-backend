import { getSectionService, updateSectionService } from "../services/section.services.js";
import { getStudentService, registerStudentService } from "../services/student.service.js";
import { getParentService, registerParentService } from "../services/parent.services.js";
import { registerStudentFromExcelSchema } from "../validators/studentSchema.validator.js";
import { hashPasswordService } from "../services/password.service.js";

export async function registerStudentsFromExcelHelper(students, sectionId, classId, adminId){
  try {
     // validate each student from excel file
    for(const student of students){
    const studentValidation =  registerStudentFromExcelSchema.validate(student);
    if(studentValidation.error){
      throw new Error(JSON.stringify({
        status: "Failed",
        student: student['firstname'],
        reason: studentValidation.error.message
      }));      
    }
    }

    // insert each student from excel file
    let insertedStudentCount = 0;
    for(const student of students){
      const { firstname, lastname, gender, bloodGroup, dob, address, city, district, state, country, pincode, parentName, phone, email, qualification, occupation } = student; 
      const parentObj = {fullname: parentName, phone, email,qualification, occupation}
      const studentObj = {firstname, lastname, gender, bloodGroup, dob, address, city, district, state, country, pincode}
      let parent = await getParentService({ phone, isActive:true });
      if(!parent){
        const parentNames = parentName.split(" ");
        const password = parentNames[0] + "@" + phone;
        parentObj['password'] = await hashPasswordService(password);
        parent = await registerParentService(parentObj);
      }
      let studentInfo = await getStudentService({ firstname, parent: parent["_id"] });
      if(!studentInfo){
        studentObj['parent'] = parent['_id']
        studentObj['section'] = sectionId
        studentObj['classId'] = classId
        studentObj['admin'] = adminId
        await registerStudentService(studentObj)
        const section = await getSectionService({_id:sectionId})
        await updateSectionService({_id:sectionId}, {studentCount: section["studentCount"]+1})
        insertedStudentCount++
      }
    }
    return insertedStudentCount
  } catch (error) {
    throw error;
  }
}


