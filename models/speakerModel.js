const mongoose=require("mongoose"); 

let speakerSchema= mongoose.Schema({
    _id:Number,
    email:String,
    userName:String,
    password:String,
    address:{city:String,street:String,building:Number}
})

module.exports=mongoose.model("Speakers",speakerSchema);