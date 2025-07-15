const express=require("express")
const router=express.Router();
const eventsController=require('../controllers/eventsController.js')

router.post('/create',eventsController.createEvent)
router.post('/register',eventsController.registerForEvent)
router.delete('/cancel',eventsController.cancelRegistration)
router.get('/getUpcoming',eventsController.getUpcomingEvents)
router.get('/get/:id',eventsController.getEventDetails)
router.get('/getStats/:id',eventsController.getStats)

module.exports=router