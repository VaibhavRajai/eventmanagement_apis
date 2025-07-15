const express=require("express")
const cors=require("cors")
require("dotenv").config()
const eventRoutes=require('./routes/events')
const app=express()
const pool=require('./db')
const PORT=process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.use('/events',eventRoutes)

app.listen(PORT,()=>{
    console.log('server started')
})