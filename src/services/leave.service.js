import leaveRequestModel from "../models/leaveRequest.model.js";

export async function getLeaveRequestsPipelineService(pipeline){
  try {
    const leaveRequests = await leaveRequestModel.aggregate(pipeline).exec();
    return leaveRequests;
  } catch (error) {
    throw error;
  }
}

export async function getLeaveRequestService(filter, projection={}) {
  try {
    const leaveRequest = await leaveRequestModel.findOne(filter).select(projection);
    return leaveRequest;
  } catch (error) {
    throw error;
  }
}

export async function registerLeaveRequestService(paramObj){
  try {
    const event = await leaveRequestModel.create(paramObj);
    return event;
  } catch (error) {
    throw error;    
  }
}

export async function updateLeaveRequestService(filter, update) {
  try {
    const event = await leaveRequestModel.updateOne(filter, update);
    return event;
  } catch (error) {
    throw error;
  }
}

export async function getLeaveRequestsCountService(filter){
  try {
    const events = await leaveRequestModel.countDocuments(filter);
    return events;
  } catch (error) {
    throw error;  
  }
}
