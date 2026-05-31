const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const chatSocket = (io) =>{

    io.use((socket, next)=>{

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

    io.on('connection', (socket)=>{
        console.log(`User Connected : ${socket.user.email} (${socket.id})`);

        socket.on('disconnect', ()=>{
            console.log(`User Disconnected : ${socket.user.email}`);
        });
    });
}

module.exports = chatSocket;