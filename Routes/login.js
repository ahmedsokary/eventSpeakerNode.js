const express=require("express"); 

const router=express.Router();
const controller=require("./../Controllers/loginController")

console.log("hereeee");
router.route("/login/admin") 
.post(controller.AdminLogin)

router.route("/login/student") 
.post(controller.studentLogin)

router.route("/login/speaker")
.post(controller.speakerLogin)
module.exports=router;