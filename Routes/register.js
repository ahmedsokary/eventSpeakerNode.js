const express=require("express"); 
const {body}=require("express-validator");

const router=express.Router();
const controller=require("./../Controllers/registerController")


router.route("/register/student")
.post(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
        body("email").isEmail().withMessage("Enter email in right format"),
        body("password").isLength({min:5}).withMessage("password must be atlest 5 elements")
    ]
    ,controller.studentRegister)

router.route("/register/speaker")
.post(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
        body("email").isEmail().withMessage("Enter email in right format"),
        body("userName").isString().withMessage("The UserName must be a string").isLength({min:5}).withMessage("Username must be atlest 5 characters"),
        body("password").isLength({min:5}).withMessage("password must be atlest 5 elements"),
        body("address.city").isString().withMessage("Enter the city as an string").isLength({min:3}).withMessage("Enter the city"),
        body("address.street").isString().withMessage("Enter the street as an string").isLength({min:3}).withMessage("Enter the street "),
        body("address.building").isNumeric().withMessage("Enter the Building as an number")
    ],
    controller.speakerRegister)
module.exports=router;