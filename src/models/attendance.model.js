 import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    date:{
        type:Number,
        required:true
    },
    day:{ 
        type:String,
        required:true,
    },
    parentAttendance:{
        type:String,
        default:""
    },
    teacherAttendance:{
        type:String,
        default:""
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"student",
        required: true
    }, 
    section:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"section"
    },
    teacher:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"teacher"
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin"
    }
},
{
   timestamps:true
});

const attendanceModel = mongoose.model("attendance",attendanceSchema);
export default attendanceModel;