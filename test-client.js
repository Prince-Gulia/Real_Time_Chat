const io = require('socket.io-client');

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0ZXN0MEBnbWFpbC5jb20iLCJpYXQiOjE3ODAyMzg4MTgsImV4cCI6MTc4MDIzOTcxOH0.JgjdvJJd82kMsOYnit4vnqA3Wd9DGWg0KbAjKXFfleU';
const socket = io( 'http://localhost:4000', {
    auth : {token} 
});

socket.on('connect', ()=>{
    console.log(`Connected successfully! Socket ID : ${socket.id}`);

    socket.emit('join_room', 'general');
});

socket.on('room_history', (data)=>{
    console.log(`Joined Room : ${data.room}`);
    
    setTimeout(()=>{
        socket.emit('send_message', 'Hello From Hell');
    }, 1000);
});

socket.on('receive_message', (data)=>{
    console.log(`[${data.sender_email}] : ${data.content}`);
});

socket.on('user_joined',(data)=>{
    console.log(data.message);
});

socket.on('error', (data)=>{
    console.log(`Error : ${data.message}`);
});

socket.on('connect_error', (err)=>{
    console.log(`Connection Failed : ${err.message}`);
});