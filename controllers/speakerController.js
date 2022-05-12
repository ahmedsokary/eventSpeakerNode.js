const speaker=require("./../models/speakerModel");
 const {validationResult}=require("express-validator");
 const events=require("./../models/eventModel");
const student=require("./../models/studentModel");

//will be removed
module.exports.getSpeaker=(request,response,next)=>{
    speaker.find({})
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch((error)=>{
        next(error);
    })
}

module.exports.updateSpeaker=(request,response,next)=>{
    if(request.role!=="speaker")
    {
        throw new Error("Not Authorized not speaker");
    }
    let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }

   // check if email exists 
    speaker.findOne({_id:request.body.id})
    .then((data)=>{
        if(data==null)
        throw new Error("speaker not exists");

        if(data.email!=request.body.email)
        {
            speaker.findOne({email:request.body.email})
            .then((data)=>{
                if(data!=null)
                   throw new Error("This email is already used");

                       //update operation
                       
                      speaker.updateOne({_id:request.body.id},
                        {$set:
                            { 
                                email:request.body.email,
                                userName:request.body.userName,
                                password:request.body.password,
                                address:{city:request.body.address.city,street:request.body.address.street,building:request.body.address.building}
                            }})
                        .then((data)=>
                        {
                            response.status(200).json({message:"speaker update",data});
                    
                        })
                        .catch(error=>next(error))
            })
            .catch(error=>next(error))
        }
        else
       {
        speaker.updateOne({_id:request.body.id},
            {$set:
                { 
                    email:request.body.email,
                    userName:request.body.userName,
                    password:request.body.password,
                    address:{city:request.body.address.city,street:request.body.address.street,building:request.body.address.building}
                }})
            .then((data)=>
            {
                response.status(200).json({message:"speaker update",data});
        
            })
            .catch(error=>next(error))
       }
    })
    .catch(error=>next(error))

    
}
//will be removed
module.exports.createSpeaker=(request,response,next)=>{

    let Speaker=new speaker({
        _id:request.body.id,
        email:request.body.email,
        userName:request.body.userName,
        password:request.body.password,
        address:{city:request.body.address.city,street:request.body.address.street,building:request.body.address.building}
    })
    Speaker.save()
    .then((data)=>{
        response.status(201).json({message:"speaker created",data});
    })
    .catch(error=>next(error));
}
 

module.exports.getEvents=(request,response,next)=>{

    if(request.role!=="speaker")
    {
        throw new Error("Not Authorized not speaker");
    }
    let eventArray=[];
    //get all events
    events.find({})
    .then((data)=>{
       
        //check in the events for the required id
       data.forEach(element => {
           //get from url
        if(element.mainSpeakerId==request.params.id)
        {
            console.log(element);
          eventArray.push(element);
        }
       });
       if(eventArray.length==0)
       throw new Error("No Event assigned");
       
       response.status(200).json(eventArray);
    })
    .catch(error=>next(error))
}