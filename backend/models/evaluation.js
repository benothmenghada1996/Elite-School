//import mongoose module
const mongoose= require("mongoose");

//create evaluation scemha
const evaluationSchema= mongoose.Schema({
    note:Number,
    evaluation:String,
    courseId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
        },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },  
});
// create evaluation model
const evaluation=mongoose.model("Evaluation",evaluationSchema);
//export model
module.exports=evaluation;
