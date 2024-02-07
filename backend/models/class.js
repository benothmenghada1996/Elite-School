//import mongoose module
const mongoose= require("mongoose");

//create class Schema
const clasSchema= mongoose.Schema({
    name:String,
    description:String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
        }],  
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }],  
});
// create Class model
const classe = mongoose.model("Class",clasSchema);
//export model
module.exports=classe;