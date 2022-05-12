const express=require("express");
const body_parser=require("body-parser");
const mongoose=require("mongoose");
//must insall to connect to another server
const cros=require("cors");

const student=require("./Routes/studentRoute");
const speaker=require("./Routes/speakerRoute");
const admin=require("./Routes/adminRoute");
const login=require("./Routes/login");
const register=require("./Routes/register");
const req = require("express/lib/request");

const server=express();

mongoose.connect("mongodb://localhost:27017/itiDb")
.then(()=>{
    console.log("Database Connected");
    server.listen(8000||process.env.PORT,()=>{
        console.log("I am Listining");
    })
})
//must insall to connect to another server
server.use(cros());

server.use((request,response,next)=>{
   console.log(request.url,request.method);
   next();
})

//body reading 
server.use(body_parser.json());
server.use(body_parser.urlencoded({extended:false}));


server.use(login);
server.use(register);

server.use(student);
server.use(speaker);
server.use(admin);


server.use((request,response)=>{
    response.status(404).json("Page Not found");
})

server.use((error,request,response,next)=>{
    response.status(500).json(error+"");
})