const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const port = process.env.port || 5000;

const rotuer = require('./router');
const { callbackify } = require('util');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', (socket) => {

    socket.on('join', ({ name, room }, useCallback) => {
        console.log(`Name: ${name}  Room: ${room}`);
        const { error, user } = addUser( { id: socket.id, name, room});

        if(error) return useCallback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`}); 

        socket.join(user.room);

    });
    
    socket.on('sendMessage', (message, useCallback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message});
    
    });

    socket.on('disconnect', () => {
        console.log('User has left.');
    })
});


app.use(rotuer);

server.listen(port, () => console.log(`Server has started on port ${port}`));

