import guestTeacherModel from "../models/guestTeacher.model.js";

export async function registerGuestTeacherService(data) {
  try {
    const teacher = await guestTeacherModel.create(data);
    return teacher;
  } catch (error) {
    throw error;
  }
}

export async function getGuestTeacherService(filter, projection = {}) {
  try {
    const teacher = await guestTeacherModel.findOne(filter).select(projection);
    return teacher;
  } catch (error) {
    throw error;
  }
}

export async function getGuestTeachersPipelineServie(pipeline) {
  try {
    const teachers = await guestTeacherModel.aggregate(pipeline);
    return teachers;
  } catch (error) {
    throw error;
  }
}

export async function updateGuestTeacherService(filter, update) {
  try {
    const teacher = await guestTeacherModel.updateOne(filter, update);
    return teacher;
  } catch (error) {
    throw error;
  }
}

export async function deleteGuestTeacherService(filter) {
  try {
    const teacher = await guestTeacherModel.findOneAndDelete(filter);
    return teacher;
  } catch (error) {
    throw error;
  }
}

export async function getGuestTeacherCountService(filter) {
  try {
    const teachers = await guestTeacherModel.countDocuments(filter);
    return teachers;
  } catch (error) {
    throw error;
  }
}
