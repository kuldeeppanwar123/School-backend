import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  rollNumber:{
    type:String
  },
  firstname: {
    type: String,
    required: true
  },
  lastname:{
    type: String,
    required: true
  },
  isActive:{
    type:Boolean,
    default: true
  },
  gender: {
    type: String,
    required:true
  },
  bloodGroup:{
    type:String,
  },
  dob:{
    type: String,
  },
  photo:{
    type: String,
  },
  address:{
    type: String
  },
  city:{
    type:String
  },
  district:{
    type:String
  },
  state:{
    type:String
  },
  country:{
    type:String
  },
  pincode:{
    type:String
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parent"
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section"
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class"
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  }
});

const studentModel = mongoose.model("student", studentSchema);
export default studentModel;