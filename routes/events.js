const express=require("express")
const router=express.Router();
const eventsController=require('../controllers/eventsController')

router.post('/create',eventsController.createEvent)

module.exports=router