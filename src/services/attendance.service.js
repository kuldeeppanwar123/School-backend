import attendanceModel from "../models/attendance.model.js";
import holidayEventModel from "../models/holidayEvent.model.js";
 

export async function getAttendanceService(paramObj){
  try {
    const attendance = await attendanceModel.findOne(paramObj).lean();
    return attendance;
  } catch (error) {
    throw error;
  }
}

export async function getAttendancesService(paramObj){
  try {
    const attendance = await attendanceModel.find(paramObj).lean();
    return attendance;
  } catch (error) {
    throw error;
  }
}

export async function updateAttendanceService(data) {
  try {
   const{id, fieldsToBeUpdated} = data;
   const attendance = await attendanceModel.findByIdAndUpdate(id, fieldsToBeUpdated);
    return attendance;
  } catch (error) {
    throw error;
  }
}

export async function createAttendanceService(data) {
  try {
    const attendance = await attendanceModel.create(data);
    return attendance;
  } catch (error) {
    throw error;
  }
}

export async function getMisMatchAttendanceService(data) {
  try {
    const{ section, startTime,endTime } = data;
    const attendance = await attendanceModel.find({section, 
       date: { $gte: startTime, $lte: endTime },
       $or: [
        { teacherAttendance: "absent", parentAttendance: "present" },
        { teacherAttendance: "present", parentAttendance: "absent" }
      ]
    }).populate("student");
    
    return attendance;
  } catch (error) {
    throw error;
  }
}
