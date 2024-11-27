import mongoose from "mongoose";

const leaveRequestSchema = mongoose.Schema({
  reason:{
    type:String,
    required: true
  },

  description:{
    type:String,
  },

  remark: {
    type: String
  },

  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    model:{
      type:String,
      required:true,
      enum: ["teacher", "student"]
    }
  },

  receiver:{
    id:{
      type: mongoose.Schema.Types.ObjectId,
      required:true
    },
    model:{
      type:String,
      required:true,
      enum:["admin", "teacher"]
    }
  },

  status:{
    type:String,
    enum:["accept", "reject", "pending", "complete"],
    default: "pending"
  },

  startTime: {
    type: Number,
    required: true
  },

  endTime: {
    type: Number,
    required: true
  },

},
{
  timestamps:true
}
);

const leaveRequestModel = mongoose.model("leaveRequest", leaveRequestSchema);

export default leaveRequestModel;
