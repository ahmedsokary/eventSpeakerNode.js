const mongoose=require("mongoose"); 

let eventSchema= mongoose.Schema({
    _id:Number,
    title:{type:String,required:true},
    eventDate:String,
    mainSpeakerId:{type:Number,ref:"Speakers"},
    otherSpeakersIds:{type:[Number],ref:"Speakers"},
    studentsIds:{type:[Number],ref:"students"}
    
})

module.exports=mongoose.model("events",eventSchema);