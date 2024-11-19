const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Setup CORS for frontend access
const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Change this to your frontend's URL
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

// Store users
const users = {};

io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle new user joining
    socket.on('new-user-joined', (name) => {
        console.log(`${name} joined the chat`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // Broadcast to other users
    });

    // Handle message send
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

    // Handle clearing of chats
    socket.on('clear-chats', () => {
        // Broadcast event to all users to clear their chats
        io.emit('clear-chats');
    });
});

server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
