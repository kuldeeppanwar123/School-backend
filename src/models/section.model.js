import mongoose from "mongoose";

const sectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  studentCount:{
    type: Number,
    default: 0
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class"
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher"
  },
  guestTeacher:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "guestTeacher"
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin"
  }
});

const sectionModel = mongoose.model("section", sectionSchema);
export default sectionModel;
