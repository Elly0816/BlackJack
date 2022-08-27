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

    //When socket is searching for user
    socket.on('search', async() => {
        socket.search = true;
        const sockets = await io.fetchSockets();
        console.log(socket);
        //Create random room for two sockets
        for (const player of sockets) {
            if (player.connected && player.search && player.id !== socket.id) {

                break;
            }
        }
    });
});



server.listen(5000, () => {
    console.log(`Listening on port: 5000`);
});