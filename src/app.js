const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const connectDB = require('./config/mongoose');
const socketIo = require('socket.io');
require('dotenv').config();
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

const io = socketIo(server, {
    cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Routes
app.use('/api', require('./routes'));

// Socket.IO connection handling
const socketHandler = require('./socket/socketHandler');
socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = server;