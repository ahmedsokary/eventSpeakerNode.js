const jwt=require("jsonwebtoken");

const student=require("./../models/studentModel");
const speaker=require("./../models/speakerModel");



module.exports.AdminLogin=(request,response,next)=>{

    let token;

    if(request.body.email=="admin@yahoo.com" && request.body.password==1234)
    {
        token=jwt.sign
        (
            {
                _id:1,
                email:request.body.email,
                role:"admin"
            },
            "encryptionhere",
            {expiresIn:"1h"}
        );

        response.status(200).json({msg:"login Admin",token});

    }
    else
    {
        throw new Error("userName and password incorrect for admin");
    }
}

module.exports.studentLogin=(request,response,next)=>{
console.log(request.body.email);
console.log(request.body.password);
    student.findOne({email:request.body.email})
        .then((data)=>{
            if(data==null)
             throw new Error("userName and password incorrect for student");
            if(data.password==request.body.password)
            {
                token=jwt.sign
                (
                    {
                        _id:data._id,
                        email:request.body.email,
                        role:"student"
                    },
                    "encryptionhere",
                    {expiresIn:"1h"}
                );
        
                response.status(200).json({stdId:data._id,token,data});

            }
            else
            {
                throw new Error("userName and password incorrect for student");
            }
        })
        .catch(error=>next(error))


}

module.exports.speakerLogin=(request,response,next)=>{

    speaker.findOne({email:request.body.email})
    .then((data)=>{
        if(data==null)
        throw new Error("userName and password incorrect for speaker");
        
        if(data.password==request.body.password)
        {
            token=jwt.sign
            (
                {
                    _id:data._id,
                    email:request.body.email,
                    role:"speaker"
                },
                "encryptionhere",
                {expiresIn:"1h"}
            );
    
            response.status(200).json({stdId:data._id,token,data});

        }
        else
        {
            throw new Error("userName and password incorrect for speaker");
        }
    })
    .catch(error=>next(error))
}