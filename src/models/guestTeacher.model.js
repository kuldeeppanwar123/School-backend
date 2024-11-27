import mongoose from "mongoose";

const guestTeacherSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  endTime: {
    type: Number,
    required: true
  },
  section:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true
  },
});

const guestTeacherModel = mongoose.model("guestTeacher", guestTeacherSchema);

export default guestTeacherModel;
