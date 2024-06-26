import mongoose from "mongoose";
const teacherSchema = mongoose.Schema({
  username: {
    type: String
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  dob: {
    type: String
  },
  bloodGroup: {
    type: String
  },
  email: {
    type: String
  },
  gender: {
    type: String
  },
  university: {
    type: String
  },
  degree: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  }
});

const teacherModel = mongoose.model("teacher", teacherSchema);

export default teacherModel;
