import studentModel from "../models/student.model.js";


export async function getStudentService(paramObj, projection={}){
  try {
    const student = await studentModel.findOne(paramObj).select(projection);
    return student; 
  }catch (error) {
    throw error;    
  }
}

export async function registerStudentService( data ){
  try {
    const student = await studentModel.create(data);
    return student;
  } catch (error) {
    throw error;
  }
}

export async function registerStudentsService(data)  {
  try{

    const students = await studentModel.insertMany(data)          
    return students;
  } catch (error){
    throw error;
  }
}
 
export async function getStudentsService(paramObj, projection={}, populateObj=""){
  try {
    const students = await studentModel.find(paramObj).select(projection).populate(populateObj);
    return students;
  } catch (error) {
    throw error;    
  }

}

export async function deleteStudentService(paramObj){
  try {
    const student = await studentModel.deleteOne(paramObj);
    return student;
  } catch (error) {
    throw error;    
  }

}

export async function updateStudentService(filter, update){
  try {
    const student = await studentModel.findOneAndUpdate(filter, update);
    return student;
  } catch (error) {
    throw error;    
  }
}

export async function getstudentsService(filter, sortingLogic, skipNumber, limitNumber,  projection={}, populateOptions=[]) {
  try {
    const students = await studentModel.find(filter).limit(limitNumber).skip(skipNumber).select(projection).populate(populateOptions);
    return students;
  } catch (error) {
    throw error;
  }
} 

export async function getStudentsPipelineService(pipeline){
  try {
    const students = await studentModel.aggregate(pipeline).exec();
    return students;
  } catch (error) {
    throw error;    
  }
}

export async function getStudentCountService(filter){
  try {
    const students = await studentModel.countDocuments(filter);
    return students;
  } catch (error) {
    throw error;  
  }
  }
  