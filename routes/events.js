const express=require("express")
const router=express.Router();
const eventsController=require('../controllers/eventsController.js')

router.post('/create',eventsController.createEvent)
router.get('/get/:id',eventsController.getEventDetails)

module.exports=router