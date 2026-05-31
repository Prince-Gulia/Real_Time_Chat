const io = require('socket.io-client');

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0ZXN0MEBnbWFpbC5jb20iLCJpYXQiOjE3Nzk4NzYwMzEsImV4cCI6MTc3OTg3NjkzMX0.CVrOa7BWbZ4kThPLE7lktupw30SxS3r9AIY7VU5-TFQ';

const socket = io( 'http://localhost:4000', {
    auth : {token} 
});

socket.on('connect', ()=>{
    console.log(`Connected successfully! Socket ID : ${socket.id}`);
});

socket.on('connect_error', (err)=>{
    console.log(`Connection Failed : ${err.message}`);
});