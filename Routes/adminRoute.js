const express=require("express");
const router=express.Router();

const {body}=require("express-validator");


const controller=require("./../controllers/adminController");
const AuthMw=require("./../MiddleWare/authMiddleWare");

//authorization
router.use(AuthMw); 


router.route("/admin/student")
.put(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
        body("email").isEmail().withMessage("Enter email in right format")
    ],
    controller.editStudent)

router.delete("/admin/student/:id",controller.removeStudent);
// .delete(controller.removeStudent)

router.route("/admin/speaker")
.put(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
        body("email").isEmail().withMessage("Enter email in right format"),
        body("address.city").isString().withMessage("Enter the city as an string").isLength({min:3}).withMessage("Enter the city"),
        body("address.street").isString().withMessage("Enter the street as an string").isLength({min:3}).withMessage("Enter the street"),
        body("address.building").isNumeric().withMessage("Enter the Building as an number")
    ],
    controller.editSpeaker)

router.delete("/admin/speaker/:id",controller.removeSpeaker);
// .delete(controller.removeSpeaker)

router.route("/admin/event") 
.get(controller.showEvent) //fehaa moshkell 
.post(
    [
        body("id").isNumeric().withMessage("The id must be a number"),
      
        body("mainSpeakerId").isNumeric().withMessage("Th min speaker must be a n number id"),

    ]
    ,controller.addEvent)
.put(
    [
        body("id").isNumeric().withMessage("The id must be a number")
    ]
    ,controller.EditEvent)
// .delete(
//     [body("id").isNumeric().withMessage("The id must be a number")]
//     ,controller.RemoveEvent)


router.delete("/admin/event/:id",controller.RemoveEvent);

//add student and speaker to any events
router.put("/admin/event/student",controller.addStudentToEvent);

router.put("/admin/event/speaker",controller.addSpeakerToEvent);
   
module.exports=router;