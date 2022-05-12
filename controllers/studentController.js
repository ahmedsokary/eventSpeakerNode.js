 const student=require("./../models/studentModel");
 const {validationResult, body}=require("express-validator");
 const events=require("./../models/eventModel");



 //will be removed
module.exports.getStudents=(request,response,next)=>{

    student.find({})
    .then((data)=>{
        response.status(200).json(data);
    })
    .catch((error)=>{
        next(error);
    })
}
///will be removedd but for triall
module.exports.posttudents=(request,response,next)=>{

   
    let std=new student({
        _id:request.body.id,
        email:request.body.email,
        password:request.body.password
    })
    std.save()
    .then((data)=>{
        response.status(201).json({message:"student Updated",data});
    })
    .catch(error=>next(error));
}

module.exports.updateStudents=(request,response,next)=>{

    if(request.role!=="student")
    {
        //throww error will stop the excution 
        throw new Error("Not Authorized not student");
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
                    response.status(200).json(data);
            
                })
                .catch(error=>next(error))
         }
     })
     //next here resume the excution 
     .catch(error=>next(error))
     
}

module.exports.getEvents=(request,response,next)=>{ 

    // console.log(request.params.id);
    if(request.role!=="student")
    {
        throw new Error("Not Authorized not student");
    }
    // console.log("heree");
    let eventArray=[];
    events.find({})
    .then((data)=>{
       data.forEach(element => {
           element.studentsIds.forEach(element2 => {
              if(element2==request.params.id)
              {
                //response.status(200).json({element});
                eventArray.push(element);
              }
           });
       });
       if(eventArray.length==0)
       throw new Error("No Event assigned");
       //send array of events
       response.status(200).json(eventArray);
    })
    .catch(error=>next(error))
}