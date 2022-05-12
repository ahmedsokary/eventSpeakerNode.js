const student=require("./../models/studentModel");
const speaker=require("./../models/speakerModel");
const event=require("./../models/eventModel");

const {validationResult}=require("express-validator");




 
module.exports.removeSpeaker=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }
//check if not used in an event
event.findOne({mainSpeakerId:request.params.id})
   .then((data)=>{
    if(data!=null)
    throw new Error("The speaker is used as a main speaker in an event");
    ///search in the array of speakers in the event
   //not handeled 7war sekaa

   //here i delte the speaker if not used in any event
   speaker.deleteOne({_id:request.params.id})
   .then((data)=>{
    if(data.deletedCount==0)
    throw new Error("speaker not exists");

    response.status(200).json({message:"speaker deleted",data});
})
//catch of the delete
.catch(error=>next(error))
})
//the catch at the end to catch error of findone 
.catch(error=>next(error))



   
}

module.exports.editSpeaker=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }

    //check on the email to be unique
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
                            response.status(200).json(data);
                    
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
                response.status(200).json(data);
        
            })
            .catch(error=>next(error))
       }
    })
    .catch(error=>next(error))
}

module.exports.removeStudent=(request,response,next)=>{
 if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }
    console.log(request.params.id);
    //from url
student.deleteOne({_id:request.params.id})
.then((data)=>{
    if(data.deletedCount==0)
    throw new Error("student not exists");

    response.status(200).json(data);
})
.catch(error=>next(error))
}

//moshkelaa fe check repetion of email
module.exports.editStudent=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }
   let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }
    
     // check if email exists 
     student.findOne({_id:request.body.id})
     .then((data)=>{
         if(data==null)
         throw new Error("student not exists");
     //console.log(data);
         if(data.email!=request.body.email)
         {
             student.findOne({email:request.body.email})
             .then((data)=>{
                 if(data!=null)
                    throw new Error("This email is already used");
     
                        //update operation
                        
                        student.updateOne({_id:request.body.id},
                         {$set:
                             { 
                                 email:request.body.email,
                                 password:request.body.password
                             }})
                         .then((data)=>
                         {
                             response.status(200).json(data);
                     
                         })
                         .catch(error=>next(error))
             })
             .catch(error=>next(error))
         }
         //nothing to update the same data
         else
         {
            student.updateOne({_id:request.body.id},
                {$set:
                    { 
                        email:request.body.email,
                        password:request.body.password
                    }})
                .then((data)=>
                {
                    response.status(200).json({message:"student update",data});
            
                })
                .catch(error=>next(error))
         }
     })
     //next here resume the excution 
     .catch(error=>next(error))
     
}

//lesa msh 3aref 2rbt el validations bl create 
module.exports.addEvent=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }

    let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }

    //check id of event
    event.findOne({_id:request.body.id})
   .then((data)=>{
       if(data!=null)
       throw new Error("This id is already used");

       //check existanse of main speaker
     speaker.findOne({_id:request.body.mainSpeakerId})
     //put async here to make the progrem wait for function
     //async here is for awit here let CheckSpeakersValue= await CheckSpeakers();
       .then(async (data)=>{
        if(data==null)
        throw new Error("No Main Speaker was found");

        //check the list of other speakers
       //async here to use awit for teh findone function
       let CheckSpeakers=  async ()=>
       {
        let arrayOfSpeakers=request.body.otherSpeakersIds;
        let flags=0;
        for(let i=0; i<arrayOfSpeakers.length; i++){
            await speaker.findOne({_id:arrayOfSpeakers[i]})

                 .then(  (data)=>
                 {  
                     if(data==null)
                     {
                        flags=1;
                     }

                 })
                 .catch(error=>next(error));
        } 
        return flags;
            
       }



       let CheckSpeakersValue= await CheckSpeakers();

       if(CheckSpeakersValue==1)
       throw new Error("No  Speaker was found in the speaker list");


      //check the list of other speakers
        let CheckStudents=  async ()=>
       {
        let arrayOfStudents=request.body.studentsIds;
        let flags=0;
        for(let i=0; i<arrayOfStudents.length; i++){
            await student.findOne({_id:arrayOfStudents[i]})

                 .then(  (data)=>
                 {  
                     if(data==null)
                     {
                        flags=1;
                     }

                 })
                 .catch(error=>next(error));
        } 
        return flags;
            
       }

       //await here belongs to the async on the then
       let CheckStudentsValue= await CheckStudents();

       if(CheckStudentsValue==1)
       throw new Error("No  Student was found in the student list");

    
       let Event= new event({
        _id:request.body.id,
        title:request.body.title,
        eventDate:request.body.eventDate,
        mainSpeakerId:request.body.mainSpeakerId,
        otherSpeakersIds:request.body.otherSpeakersIds,
        studentsIds:request.body.studentsIds

    })
    
    Event.save()
    .then((data)=>{
        response.status(201).json({message:"Event Created",data});
    })
    .catch(error=>next(error));
            

      
       })
       .catch(error=>next(error));

   })
   .catch(error=>next(error));
      
}

//lesa msh 3aref 2rbt el validations bl update
module.exports.EditEvent=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }
    let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }

//check if event exists
event.findOne({_id:request.body.id})
.then((data)=>{
    if(data==null)
    throw new Error("There is not event with that id");

    //check existanse of main speaker
  speaker.findOne({_id:request.body.mainSpeakerId})
  //put async here to make the progrem wait for function
  //async here is for awit here let CheckSpeakersValue= await CheckSpeakers();
    .then(async (data)=>{
     if(data==null)
     throw new Error("No Main Speaker was found");

     //check the list of other speakers
    //async here to use awit for teh findone function
    let CheckSpeakers=  async ()=>
    {
     let arrayOfSpeakers=request.body.otherSpeakersIds;
     let flags=0;
     for(let i=0; i<arrayOfSpeakers.length; i++){
         await speaker.findOne({_id:arrayOfSpeakers[i]})

              .then(  (data)=>
              {  
                  if(data==null)
                  {
                     flags=1;
                  }

              })
              .catch(error=>next(error));
     } 
     return flags;
         
    }



    let CheckSpeakersValue= await CheckSpeakers();

    if(CheckSpeakersValue==1)
    throw new Error("No  Speaker was found in the speaker list");


   //check the list of other speakers
     let CheckStudents=  async ()=>
    {
     let arrayOfStudents=request.body.studentsIds;
     let flags=0;
     for(let i=0; i<arrayOfStudents.length; i++){
         await student.findOne({_id:arrayOfStudents[i]})

              .then(  (data)=>
              {  
                  if(data==null)
                  {
                     flags=1;
                  }

              })
              .catch(error=>next(error));
     } 
     return flags;
         
    }

    //await here belongs to the async on the then
    let CheckStudentsValue= await CheckStudents();

    if(CheckStudentsValue==1)
    throw new Error("No  Student was found in the student list");

 
    event.updateOne({_id:request.body.id},
        {$set:
            { 
                _id:request.body.id,
                title:request.body.title,
                eventDate:request.body.eventDate,
                mainSpeakerId:request.body.mainSpeakerId,
                otherSpeakersIds:request.body.otherSpeakersIds,
                studentsIds:request.body.studentsIds
            }})
        .then((data)=>
        {
            if(data.matchedCount==0)
            throw new Error("event not exists");
    
            response.status(200).json({message:"event update",data});
    
        })
        .catch(error=>next(error))
         

   
    })
    .catch(error=>next(error));

})
.catch(error=>next(error));


}

module.exports.RemoveEvent=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }
    let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }

    event.deleteOne({_id:request.params.id})
.then((data)=>{
    if(data.deletedCount==0)
    throw new Error("event not exists");

    response.status(200).json({message:"event deleted",data});
})
.catch(error=>next(error))
}

module.exports.showEvent=(request,response,next)=>{

    event.find({})
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch((error)=>{
        next(error);
    })
}



module.exports.addSpeakerToEvent=(request,response,next)=>{
    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }

    //check on the email to be unique
    let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }

    speaker.findOne({_id:request.body.Id})
    .then((data1)=>
    {
        if(data1==null)
        throw new Error("speaker not exists");

        event.findOne({_id:request.body.eventId})
        .then((data2)=>{
            if(data2==null)
            throw new Error("event not exists");
            
              //assign new student to event
              let element=[] ;
              element=data2.otherSpeakersIds
              element.push(request.body.Id);
   
           //    console.log(element);
            event.updateOne({_id:request.body.eventId},
                {$set:
                    { 
                        otherSpeakersIds:element
                    }})
                    .then((data)=>
                    {
                        response.status(200).json(data);
                    })
                    .catch(error=>next(error))
    
        })
        .catch(error=>next(error))
    }
    )
    .catch(error=>next(error))

}

module.exports.addStudentToEvent=(request,response,next)=>{

    if(request.role!=="admin")
    {
        throw new Error("Not Authorized not admin");
    }

    //check on the email to be unique
    let result=validationResult(request);
    //check validation
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }

    student.findOne({_id:request.body.Id})
    .then((data1)=>
    {
        if(data1==null)
        throw new Error("student not exists");

        event.findOne({_id:request.body.eventId})
        .then((data2)=>{
            if(data2==null)
            throw new Error("event not exists");

             //assign new student to event
             let element=[] ;
             element=data2.studentsIds
             element.push(request.body.Id);
  
          //    console.log(element);
            event.updateOne({_id:request.body.eventId},
                {$set:
                    { 
                        studentsIds:element
                    }})
                    .then((data)=>
                    {
                        response.status(200).json({message:"event update",data});
                    })
                    .catch(error=>next(error))
    
        })
        .catch(error=>next(error))
    }
    )
    .catch(error=>next(error))

}