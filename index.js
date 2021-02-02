const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const port = process.env.port || 5000;

const rotuer = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {
    console.log('We have a new connection.');

    socket.on('name', console.log)

    socket.on('disconnect', () => {
        console.log('User has left.');
    })
});


app.use(rotuer);

server.listen(port, () => console.log(`Server has started on port ${port}`));

