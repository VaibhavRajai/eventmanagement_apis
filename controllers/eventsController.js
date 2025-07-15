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

module.exports={createEvent,getEventDetails}