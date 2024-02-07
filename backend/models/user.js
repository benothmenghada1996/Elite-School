//import mongoose module
const mongoose= require("mongoose");
//import mongoose-unique-validator
// const uniqueValidator=require("mongoose-unique-validator");

//create User Schema
const userSchema= mongoose.Schema({
    firstName:String,
    lastName:String,
    email: String,//{type:String,unique:true},
    tel: String,//{type:String,unique:true},
    adress:String,
    pwd:String,
    speciality:String,
    sonTel:String,
    status:String,
    role:String,
    avatar:String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    // classes: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Class"
    // }]
});
// userSchema.plugin(uniqueValidator);
// create User model
const user=mongoose.model("User",userSchema);
//export model
module.exports=user;