import superAdminModel from "../models/superAdmin.model.js";

export async function getSuperAdminService(filter, projection={}) {
  try {
    const superAdmin = await superAdminModel.findOne(filter).select(projection);
    return superAdmin;
  } catch (error) {
    throw error;
  }
}

export async function registerSuperAdminService(data) {
  try {
    const superAdmin = await superAdminModel.create(data);
    return superAdmin;
  } catch (error) {
    throw error;
  }
}

export async function updateSuperAdminService(filter, update) {
  try {
    console.log({filter, update});
    const superAdmin = await superAdminModel.updateOne(filter, update);
    console.log({superAdmin});
    return superAdmin;
  } catch (error) {
    throw error;
  }
}