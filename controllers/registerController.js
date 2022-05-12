const student=require("./../models/studentModel");
const speaker=require("./../models/speakerModel")
const {validationResult}=require("express-validator");

const jwt=require("jsonwebtoken");


module.exports.studentRegister=(request,response,next)=>{

    console.log("hereee");
    let result=validationResult(request);
    //for token
    let token;
    //check validation
   
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+" "," ");
        throw new Error(message)
    }
    student.findOne({email:request.body.email})
    .then((data)=>{
        if(data!=null)
        throw new Error("This email is already used");
        let std=new student({
            _id:request.body.id,
            email:request.body.email,
            password:request.body.password
        })
        std.save()
        .then((data)=>{

            //for the token
            token=jwt.sign
            (
                {
                    _id:request.body.id,
                    email:request.body.email,
                    role:"student"
                },
                "encryptionhere",
                {expiresIn:"1h"}
            );

            response.status(201).json({data,token});
        })
        .catch(error=>next(error));
    
    })
    .catch(error=>next(error))


   

    
}


module.exports.speakerRegister=(request,response,next)=>{

    let token;
    //check validation
   
    let result=validationResult(request);
    //check validation
   
    if(!result.isEmpty())
    {
        let message=result.array().reduce((current,error)=>current+error.msg+"-------\n"," ");
        throw new Error(message)
    }
    speaker.findOne({email:request.body.email}) 
    .then((data)=>{
        if(data!=null)
        throw new Error("This email is already used");
        let Speaker=new speaker({
            _id:request.body.id,
            email:request.body.email,
            userName:request.body.userName,
            password:request.body.password,
            address:{city:request.body.address.city,street:request.body.address.street,building:request.body.address.building}
        })
        Speaker.save()
        .then((data)=>{

               //for the token
               token=jwt.sign
               (
                   {
                       _id:request.body.id,
                       email:request.body.email,
                       role:"speaker"
                   },
                   "encryptionhere",
                   {expiresIn:"1h"}
               );
   
            response.status(201).json({data,token});
        })
        .catch(error=>next(error));
    })
    .catch(error=>next(error))


   

   
    
}