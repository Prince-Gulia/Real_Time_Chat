const pool = require('../config/db');

const getAllRooms = async(req, res)=>{
    try{
        const rooms = await pool.query(
            `SELECT * FROM rooms
            ORDER BY created_at ASC`
        );

        return res.status(200).json({
            message : "Rooms Fetched successfully",
            rooms : rooms.rows
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

const newRoom = async (req, res)=>{
    const { name } = req.body;

    try{
        if(!name){
            return res.status(400).json({ message : "Room name is Required" });
        }

        const existing = await pool.query(
            `SELECT * FROM rooms
            WHERE name = $1`
            ,[name]
        );

        if(existing.rowCount > 0){
            return res.status(400).json({ message : "Room already exists" });
        }

        const room = await pool.query(
            `INSERT INTO rooms (name)
            VALUES ($1)
            RETURNING *`
            ,[name]
        );

        res.status(201).json({
            message : "Room created successfully",
            room : room.rows[0]
        });
    } catch(err){
        console.error(err.message);
        res.status(500).json({ message : "Server Error" });
    }
}

module.exports = { getAllRooms, newRoom };