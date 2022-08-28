const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const async = require('async');

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
    // console.log(socket);
    console.log(`The client connected to the socket on id: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
    //When socket is searching for user
    socket.on('search', () => {
        //Variable to store the other player
        socket.search = true;
        socket.emit('searching');
        console.log('searching');
        //Get all the sockets
        // console.log(socket);
        // console.log(sockets);
        // console.log(socket.id.length);

        async function getSockets() {
            const ids = [];
            const sockets = await io.fetchSockets();
            for (single of sockets) {
                if (single.connected && single.search) {
                    ids.push(single.id);
                };
            }
            console.log(ids);
            return ids;
        };

        getSockets().then((res) => {
            socket.emit('sockets', res);
        });


        //Set duration for search to last

        // console.log(`endtime: ${endSearch}\n startTime: ${startSearch}`);
        //If time is up and a room was created

    });
});



server.listen(5000, () => {
    console.log(`Listening on port: 5000`);
});