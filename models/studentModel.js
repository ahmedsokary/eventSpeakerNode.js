const mongoose=require("mongoose");

let studentSchema= mongoose.Schema({
    _id:Number,
    email:String,
    password:String
})

module.exports=mongoose.model("students",studentSchema);