import { updateSectionService } from '../../services/section.services.js';
import { deleteGuestTeacherService, getGuestTeachersService, updateGuestTeacherService } from '../../services/guestTeacher.service.js';
import { getLeaveRequestsService, updateLeaveRequestService } from '../../services/leave.service.js';


const invalidateGuestTeacherJob =  async() => {
  try {
  let date = new Date()
  date = date.getTime()
  console.log("invalidate guest teachers ",date)

  const leaveRequests = await getLeaveRequestsService({endTime : {$lte: date}, status: 'accept'});
  const expiredGuestTeachers = await getGuestTeachersService({endTime: {$lte: date}});

  for (const leaveRequest of leaveRequests) {
    await updateLeaveRequestService({ _id: leaveRequest['_id'] }, { status: 'complete' })
  }

  for (const guestTeacher of expiredGuestTeachers) {
    await Promise.all([
      updateGuestTeacherService({ _id: guestTeacher["_id"] }, { isActive: false }),
      updateSectionService({_id: guestTeacher['section']}, {guestTeacher: null})
    ])
  }
} catch (error) {
  console.log(error.message)  
}
}

export default invalidateGuestTeacherJob;
