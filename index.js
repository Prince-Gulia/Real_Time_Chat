require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const chatSocket = require('./socket/chatSocket');
chatSocket(io);

app.get('/', (req, res) => {
  res.json({ message: 'Chat API is running' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port : ${PORT}`));