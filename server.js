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
    let newRoom;
    //Variable to store the other player
    let otherPlayer;
    //When socket is searching for user
    socket.on('search', async() => {
        socket.emit('searching');
        socket.search = true;
        const sockets = await io.fetchSockets(); //Get all the sockets
        // console.log(socket);
        // console.log(sockets);
        // console.log(socket.id.length);

        //Set duration for search to last
        let startSearch = Date.now();
        let endSearch = startSearch + 30000;

        while (Date.now() < endSearch && startSearch < endSearch) {
            if (sockets.length > 1) {
                for (const player of sockets) {
                    if (player.connected && player.search && player.id !== socket.id) {
                        socket.search = false;
                        player.search = false;
                        newRoom = `${socket.id}${player.id}`;
                        player.join(newRoom);
                        socket.join(newRoom); //Join the room of the player waiting
                        otherPlayer = player;
                        startSearch = endSearch;
                        break;
                    };
                };
            };
            console.log(`endtime: ${endSearch}\n startTime: ${startSearch}`);
        };
        //If time is up and a room was created
        if (newRoom) {
            io.to(newRoom).emit("ready");
        } else { //Time is up and no room was created
            console.log('time up');
            socket.emit('time up')
        }
    });
});



server.listen(5000, () => {
    console.log(`Listening on port: 5000`);
});