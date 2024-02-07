//import mongoose module
const mongoose= require("mongoose");

//create course Schema
const courseSchema= mongoose.Schema({
    name:String,
    description:String,
    duration:String,
    avatar:String,
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }], 
});
// create Course model
const course=mongoose.model("Course",courseSchema);
//export model
module.exports=course;