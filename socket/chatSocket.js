const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const chatSocket = (io) =>{

    io.use((socket, next)=>{ //Middleware for authentication in server

        const token = socket.handshake.auth.token;

        if(!token || !token.startsWith('Bearer')){
            return next(new Error('No Token Provided'));
        }

        const rawToken = token.split(' ')[1];

        try{
            const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch(err){
            return next(new Error('Invalid or Expired Token'));
        }
    });

    //Connection of a user

    io.on('connection', (socket)=>{
        console.log(`User Connected : ${socket.user.email} (${socket.id})`);

        socket.on('join_room', async(roomName) => {
            try{
                const room = await pool.query(`
                    SELECT * FROM rooms 
                    WHERE name = $1
                `, [roomName]);

                if (room.rowCount === 0){
                    return socket.emit('error', { message : "Room not found" });
                }

                socket.join(roomName);
                socket.currentRoom = roomName;

                const messages = await pool.query(`
                    SELECT messages.*, users.email as sender_email
                    FROM messages
                    JOIN users
                    ON messages.user_id = users.id
                    WHERE messages.room_id = $1
                    ORDER BY messages.created_at DESC
                    LIMIT 20
                `, [room.rows[0].id]);

                socket.emit('room_history', {
                    room : roomName,
                    messages : messages.rows.reverse()
                });

                socket.to(roomName).emit('user_joined', {
                    message : `${socket.user.email} joined ${roomName}`
                });

                console.log(`${socket.user.email} joined ${roomName}`);
            } catch(err){
                console.error(err.message);
                socket.emit('error', { message : "Server Error" });
            }
        })

        //User sending a message

        socket.on('send_message', async (content)=>{
            try{

                if(!socket.currentRoom){
                    return socket.emit('error', { message : "join a room first" });
                }

                const room = await pool.query(
                    `SELECT * FROM rooms
                    WHERE name = $1`
                    ,[socket.currentRoom]
                );

                if(room.rowCount === 0){
                    return socket.emit('error', { message : "Room Does not exist" });
                }

                const message = await pool.query(
                    `INSERT INTO messages (content, user_id, room_id)
                    VALUES ($1, $2, $3)
                    RETURNING *`
                    ,[content, socket.user.id, room.rows[0].id]
                );

                io.to(socket.currentRoom).emit('receive_message',{
                    id : message.rows[0].id,
                    content : message.rows[0].content,
                    sender_email : socket.user.email,
                    created_at : message.rows[0].created_at
                });
            } catch(err){
                console.error(err.message);
                socket.emit('error', { message : "Server Error" });
            }
        })

        //Disconnection of a user
        socket.on('disconnect', ()=>{
            console.log(`User Disconnected : ${socket.user.email}`);

            if(socket.currentRoom){
                socket.to(socket.currentRoom).emit('user_left', { 
                    message : `${socket.user.email} left ${socket.currentRoom}` 
                });
            }
        });

        //User leaving the room
        socket.on('leave_room', ()=>{
            if(socket.currentRoom){
                socket.to(socket.currentRoom).emit('user_left', {
                    message : `${socket.user.email} left ${socket.currentRoom}`
                });

                socket.leave(socket.currentRoom);
                socket.currentRoom = null;
                socket.emit('left_room', { message : "User left successfully" });
            }
        })

    });
}

module.exports = chatSocket;