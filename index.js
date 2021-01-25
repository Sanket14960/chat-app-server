const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// Change for production 
const port = process.env.port || 5000;

const rotuer = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('We have a new connection.');

    socket.on('disconnect', () => {
        console.log('User has left.');
    })
});


app.use(rotuer);

server.listen(port, () => console.log(`Server has started on port ${port}`));

