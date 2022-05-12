const express=require("express");  
const router=express.Router();

const {body}=require("express-validator");

const controller=require("./../controllers/speakerController");
const authMw=require("./../MiddleWare/authMiddleWare");


router.route("/speaker") 
.get(controller.getSpeaker)

//authorization
//router.use(authMw)

router.route("/speaker")
//.get(controller.getEvents)
.put(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
        body("email").isEmail().withMessage("Enter email in right format"),
        body("userName").isString().withMessage("The UserName must be a string").isLength({min:5}).withMessage("Username must be atlest 5 characters"),
        body("password").isString().withMessage("The password must be a string"),
        body("address.city").isString().withMessage("Enter the city as an string"),
        body("address.street").isString().withMessage("Enter the street as an string"),
        body("address.building").isNumeric().withMessage("Enter the Building as an number")


    ],
    controller.updateSpeaker)

//.post(controller.createSpeaker)

router.get("/speaker/:id",controller.getEvents);

module.exports=router;