const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let onAir = false;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {

    console.log('Client connected');

    socket.emit('status', onAir);

    socket.on('start-broadcast', () => {
        onAir = true;
        io.emit('status', true);
        console.log('Broadcast START');
    });

    socket.on('stop-broadcast', () => {
        onAir = false;
        io.emit('status', false);
        console.log('Broadcast STOP');
    });

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
