const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const {
    cards,
    gameState,
    gameRoom,
    gamePlayer
} = require('./gameDetails2');

const {
    shuffle,
    countCards,
    calculateWinner,
    dealCards,
    reverseString,
    roomsWithoutgameRoom,
    getSocket
} = require('./functions');

const _ = require('lodash');


app.use(cors());

const PORT = process.env.PORT || 5000;

server = http.Server(app);

/*
 io = socketIO(server, {
     cors: {
         origin: process.env.CLIENT, 
         methods: ["GET", "POST"]
     }
 });
*/

io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});





//Websocket

/*
    An array of game rooms hold the gameroom objects with properties of room,
    numOfPlayers and game.
*/
let gameRooms = [];


/*
    The  events that are emitted by the client socket are:
    connection, disconnect, search, stand, hit, game over, 

    The events that are emitted by the server socket are:
    joined, game, hide buttons, show buttons, game state;


*/

io.on('connection', (socket) => {
    console.log(`A connection has been made with socket id: ${socket.id}`);
    let currentGameRoom = null;
    let me = null;
    let opponent = null;
    let game = null;
    let room = null;
    let currentPlayers = [];


    //When the socket has been disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected.`);
        gameRooms = roomsWithoutgameRoom(socket, gameRooms);
        console.log('This is the game room');
        console.log(gameRooms);

    });

    //When the user searches for another socket to connect to 
    socket.on('search', () => {

        if (gameRooms.length > 0) {
            for (const gameRoom of gameRooms) {
                if (gameRoom.numOfPlayers < 2 && gameRoom.roomSocket.id !== reverseString(socket.id)) {
                    socket.join(gameRoom.roomSocket);
                    currentGameRoom = gameRoom;
                    // socket.searching = false;
                    currentGameRoom.idsInRoom.push(socket.id);
                    currentGameRoom.numOfPlayers = currentGameRoom.idsInRoom.length;
                    room = currentGameRoom.roomSocket;
                    game = currentGameRoom.game;
                    me = _.cloneDeep(gamePlayer);
                    me.id = socket.id;
                    // me.cards = [];
                    game.players.push(me);
                    io.to(room).emit('joined', game);
                    // joined = true;
                    for (const player of game.players) {
                        if (player.id === socket.id) {
                            me = player;
                        } else {
                            opponent = player;
                        }
                    }
                    game.deck = shuffle(cards);
                    dealCards(io, gameRoom)
                        .then(() => {
                            // console.log(gameRoom.game);
                            for (const player of game.players) {
                                console.log(player.cards);
                            }
                        })
                    break;
                }
            }
        } else { //There is no room in the game Rooms array
            currentGameRoom = _.cloneDeep(gameRoom);
            // currentGameRoom.idsInRoom = [];
            currentGameRoom.roomSocket = reverseString(socket.id);
            currentGameRoom.idsInRoom.push(socket.id);
            currentGameRoom.numOfPlayers = currentGameRoom.idsInRoom.length;
            currentGameRoom.game = _.cloneDeep(gameState);
            // currentGameRoom.game.deck = [];
            // currentGameRoom.game.players = [];
            // currentGameRoom.game.dealer.cards = [];
            // currentGameRoom.game.dealer.backCard = true;
            game = currentGameRoom.game;
            room = currentGameRoom.roomSocket;
            // socket.searching = false;
            me = _.cloneDeep(gamePlayer);
            me.id = socket.id;
            // me.cards = [];
            currentGameRoom.game.players.push(me);
            socket.join(room);
            currentGameRoom.numOfPlayers = currentGameRoom.idsInRoom.length;
            gameRooms.push(currentGameRoom);
            console.log('This is the game after first person');
            console.log(game);
            console.log('This is the game room after first person');
            console.log(currentGameRoom);
            socket.emit('waiting');
        }
    });


    //Handle user hits and stand
    socket.on('stand', () => {
        socket.emit('hide buttons');
        /*
         Set me and opponent to their respective player objects in the game object 
        */
        for (const player of game.players) {
            if (player.id === socket.id) {
                me = player;
                console.log('me');
                // console.log(me);
            } else {
                opponent = player;
                console.log(`opponent`);
                // console.log(opponent);
            };
        };
        /*
        Set the opponent socket to socket that belongs to the other player 
        */
        for (const player of currentPlayers) {
            if (player.id !== socket.id) {
                opponentSocket = player;
            };
        };
        me.lastPlay = 'stand';
        // let total = countCards(me.cards);
        let opponentTotal = countCards(opponent.cards);
        // console.log("Game: ", game);
        //If other player also stands
        if (opponent.lastPlay === 'stand' || opponentTotal >= 21) {
            /*flip the dealer's first card, count the scores and add until dealer total is 
            equal to or greater than 17
            */
            calculateWinner(game, me, opponent, socket, opponentSocket, room, io);

        } else {
            opponentSocket.emit('show buttons');
            // io.to(room).emit('game state', game);
        }
        io.to(room).emit('game state', game);
        console.log(game);
    });

    //When a player hits
    socket.on('hit', () => {
        /*
         Set me and opponent to their respective player objects in the game object 
        */
        console.log('This is the current game room');
        console.log(currentGameRoom);
        for (const player of game.players) {
            if (player.id === socket.id) {
                me = player;
            } else {
                opponent = player;
                opponentSocket = getSocket(io, player.id);
            };
        };
        /*
        Set the opponent socket to socket that belongs to the other player 
        */
        me.lastPlay = 'hit';
        console.log('This is the game in server in line 180');
        console.log(game);
        me.cards.push(game.deck.pop());
        console.log(game);
        let total = countCards(me.cards);
        let opponentTotal = countCards(opponent.cards);
        if (total === 21) {
            socket.emit('hide buttons');
            me.total = 'BlackJack';
            io.to(room).emit('game state', game);
            if (opponentTotal >= 21 || opponent.lastPlay === 'stand') {
                /*
                    Calculate the current score and see if blackjack or bust
                    and deal cards to the dealer

                */
                calculateWinner(game, me, opponent, socket, opponentSocket, room, io);

            } else {
                opponentSocket.emit('show buttons');
            }
        } else if (total > 21) {
            me.total = 'Bust';
            io.to(room).emit('game state', game);
            socket.emit('hide buttons');
            if (opponentTotal >= 21 || opponent.lastPlay === 'stand') {
                calculateWinner(game, me, opponent, socket, opponentSocket, room, io);
            } else {
                opponentSocket.emit('show buttons');
            }
        } else {
            me.total = total;
            io.to(room).emit('game state', game);
        };
        io.to(room).emit('game state', game);
        console.log(game);
    });

    socket.on('game over', () => {
        gameRooms = roomsWithoutgameRoom(socket, gameRooms);

        console.log('game over', game);
    });

});





server.listen(PORT, () => {
    console.log(`The server has been started on port: ${PORT}`);
});