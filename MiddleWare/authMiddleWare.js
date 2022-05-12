
const jwt =require("jsonwebtoken");

module.exports=(request,response,next)=>{

    let token,decodedToken;
    try
    {
        token=request.get("Authorization").split(" ")[1];
        decodedToken=jwt.verify(token, "encryptionhere");
      //  console.log(decodedToken);

    }
    catch(error)
    {
        next(new Error("Not Authorized"));

    }
    ///to determine the role
    request.role=decodedToken.role;
    //checkk
    //must be there to exit this page and  go to the next command
    next();
}