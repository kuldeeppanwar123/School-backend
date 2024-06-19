import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  rollNumber: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Non-binary", "Other"]
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String
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
