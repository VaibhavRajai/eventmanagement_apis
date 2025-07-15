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

module.exports={createEvent}