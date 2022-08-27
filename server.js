const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const port = 5000;


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', 1);

const server = http.createServer(app);

//Creates the websocket

const io = new Server(server, {
    cors: {
        origin: process.eventNames.CLIENT,
        methods: ["GET", "POST"]
    }
})

//Using the created websocket
io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected to the server`);
});




app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
});