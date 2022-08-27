const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server = http.Server(app);
// server.listen(5000);

io = socketIO(server, {
    cors: {
        origin: '*'
    }
});


//Websocket

io.on('connection', (socket) => {
    console.log(`The client connected to the socket on id: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});



server.listen(5000, () => {
    console.log(`Listening on port: 5000`);
});