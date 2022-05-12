const express=require("express"); 
const router=express.Router();

const {body}=require("express-validator");

const controller=require("./../controllers/studentController");
const authMw=require("./../MiddleWare/authMiddleWare");

//authorization
router.use(authMw)

router.route("/student")
.get(controller.getStudents)
.put(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
        body("email").isEmail().withMessage("Enter email in right format"),
        body("password").isString().withMessage("The password must be a string")
    ]
    ,controller.updateStudents)
.post(controller.posttudents)

// //update student from url
// router.put("/student/:id",  [
//     body("id").isNumeric().withMessage("The id must be a number"),
//     body("email").isEmail().withMessage("Enter email in right format"),
//     body("password").isString().withMessage("The password must be a string")
// ]
// ,controller.updateStudents);

//get events from url
router.get("/student/:id",controller.getEvents);

module.exports=router;