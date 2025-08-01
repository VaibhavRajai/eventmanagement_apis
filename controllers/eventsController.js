const pool=require('../db')

const createEvent=async(req,res)=>{
    const {title,datetime,location,capacity}=req.body;
      if (!title || !datetime || !location || !capacity) {
        return res.status(400).json({ error: 'all fields are required' });
    }
    if(capacity<0 || capacity>1000){
        return res.status(400).json({error:'capacity must be between 1 and 1000'})
    }
    try{
        const result=await pool.query('INSERT INTO events (title, datetime, location, capacity) VALUES ($1,$2,$3,$4) RETURNING id',
            [title,datetime,location,capacity]);
        const event_id=result.rows[0].id;
        res.status(201).json({message:'event crated succesfully',event_id})
    }catch(error){
        res.status(500).json({ error: error });
    }
}

const getEventDetails=async(req,res)=>{
    const event_id=req.params.id;
    try{
        const event_res=await pool.query('SELECT * FROM events WHERE ID = $1',[event_id]);
        if(event_res.rows.length===0){
            return res.status(404).json({message:'event not found'})
        }
        const event=event_res.rows[0]
        const user_res=await pool.query(`SELECT users.id,users.name,users.email FROM users JOIN registrations ON users.id=registrations.user.id
            WHERE registrations.event_id=$1
            `,[event_id])
            const registeredUsers=user_res.rows;
            res.json({event,registered_users:registeredUers})

    }catch(error){
      res.status(500).json({ error: error });   
    }
}
const registerForEvent=async(req,res)=>{
    const {event_id,user_id}=req.params.body;
    try{
        if(!event_id || !user_id){
            return res.status(400).json({message:'user and event are required'})
        }
        const doEventExists=await pool.query('SELECT * FROM events WHERE id=$1',[event_id]);
        if(doEventExists.rows.length===0){
            return res.status(404).json({message:'event does not exists'})
        }
        const event=doEventExists.rows[0];
        if(new Date(event.datetime)<new Date()){
            return res.status(400).json({message:'event date is expired'})
        }
        const existing=await pool.query('SELECT * FROM registrations WHERE evennt_id =$1 AND user_id = $2',[event_id,user_id])
        if(existing.rows.length>0){
            return res.status(409).json({message:'user with user id already regsitered'})
        }
        const countResult=await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id=$1',[event_id])
        const registered=parseInt(countResult.rows[0].count)
        if(registered>event.capacity){
            return res.status(400).json({message:'event capacity is full'})
        }
        await pool.query('INSERT INTO registrations (event_id,used_id) VALUES ($1,$2)',[event_id,user_id]);
        res.status(200).json({message:'user registered successfully'})

    }catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}
const cancelRegistration=async(req,res)=>{
    const {user_id,event_id}=req.body;
    if(!user_id || !event_id){
        return res.status(400).json({message:'user and event id is required'})
    }
    try{
        const res=await pool.query('SELECT * FROM registrations WHERE event_id = $1 AND user_id=$2',[event_id,user_id])
        if(res.rows.length===0){
            return res.status(404).json({message:'user with this used id has not registered'})
        }
        await pool.query('DELETE FROM registrations WHERE event_id = $1 AND user_id = $2',[event_id,user_id])
        res.status(200).json({message:'registration cancelled sucessfully!!'})
    }catch(error){
           res.status(500).json({ error: "Internal server error" });
    }
}
const getUpcomingEvents=async(req,res)=>{
    try{
        const result=await pool.query('SELECT * FROM events WHERE datetime>NOW() ORDER BY datetime ASC , location ASC')
        res.status(200).json({data:result})
    }catch(error){
           res.status(500).json({ error: "Internal server error" });
    }
}
const getStats=async(req,res)=>{
    const {event_id}=req.params;
    try{
        const result=await pool.query('SELECT * FROM events WHERE event_id=$1',[event_id])
        if(result.rows.length===0){
            return res.status(404).json({message:'event with this event id does not exists'})
        }
        const event=result.rows[0];
        const registrations=await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1',[event_id])
        const totalRegistratrion=parseInt(registrations.rows[0].count)
          const remainingCapacity = event.capacity - totalRegistrations;
        const percentageUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);
           res.status(200).json({
      event_id,
      total_registrations: totalRegistratrion,
      remaining_capacity: remainingCapacity,
      percentage_used: `${percentageUsed}%`
    });
    }catch(error){
         res.status(500).json({ error: "Internal server error" });
    }
}

module.exports={createEvent,getEventDetails,registerForEvent,cancelRegistration,getUpcomingEvents,getStats}