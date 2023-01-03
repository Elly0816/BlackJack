const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { cards, gameState, gameRoom, gamePlayer } = require('./gameDetails');
const {
    shuffle,
    countCards,
    calculateWinner,
    dealCards,
    reverseString,
    roomsWithoutgameRoom
} = require('./functions');


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
// let room;
// let opponentSocket;
// let gameSession = {...mainGame };
// let { room, game } = {...gameSession };
// let [me, opponent] = [null, null];
// let game = {...gameState };

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

        // function removeFromRoom(socket, gameRooms) {
        //     let roomToRemove;
        //     for (let gameRoom of gameRooms) {
        //         roomToRemove = gameRoom.roomSocket.id;
        //         if (gameRoom.idsInRoom.includes(socket.id)) {
        //             socket.leave(gameRoom.roomSocket);
        //             gameRoom.idsInRoom = gameRoom.idsInRoom.filter(id => id !== socket.id);
        //             gameRoom.numOfPlayers -= 1;
        //             if (gameRoom.numOfPlayers === 0) {
        //                 gameRooms = gameRooms.filter(gameRoom => {
        //                     gameRoom.roomSocket.id !== roomToRemove;
        //                 });
        //             };
        //             break;
        //         }
        //     }
        // }

    });

    //When the user searches for another socket to connect to 
    socket.on('search', () => {
        //Set the socket's searching property to true
        // console.log(game, 'this is the game state while searching');
        // game = {...gameState };
        socket.searching = true;
        // [me, opponent] = game.players;
        //Get all the connected and searching sockets

        // Create a room and add both sockets to it 
        /*
            Get the available sockets, 
            If there is another player searching, 
            get the player's socket, 
            set a new game room to a gameRoom object
            set the current game to a game object,
            set the current game to a new game and add 
            that to the game room's object's game property

            set the 
        */

        if (gameRooms.length > 0) {
            for (const gameRoom of gameRooms) {
                if (gameRoom.numOfPlayers < 2 && gameRoom.roomSocket.id !== reverseString(socket.id)) {
                    socket.join(gameRoom.roomSocket);
                    socket.searching = false;
                    gameRoom.idsInRoom.push(socket.id);
                    gameRoom.numOfPlayers += 1;
                    room = gameRoom.roomSocket;
                    game = gameRoom.game;
                    console.log('This is my socket id');
                    console.log(socket.id);
                    console.log('This is the game room');
                    console.log(gameRoom);
                    console.log('This is the game');
                    console.log(game);
                    me = {...gamePlayer };
                    me.id = socket.id;
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
                    console.log('This is the opponent');
                    console.log(opponent);
                    console.log('This is the game after pushing');
                    console.log(game);
                    opponentSocket = io.sockets.sockets.get(opponent.id);
                    dealCards(io, gameRoom);
                    break;
                }
            }
        } else {
            currentGameRoom = {...gameRoom };
            game = {...gameState };
            // console.log("This is the first socket's id");
            // console.log(typeof socket.id);
            currentGameRoom.roomSocket = reverseString(socket.id);
            currentGameRoom.idsInRoom.push(socket.id);
            currentGameRoom.game = game;
            room = currentGameRoom.roomSocket;
            socket.searching = false;
            me = {...gamePlayer };
            me.id = socket.id;
            game.players.push(me);
            socket.join(room);
            currentGameRoom.numOfPlayers += 1;
            gameRooms.push(currentGameRoom);
            console.log('This is the game after first person');
            console.log(game);
            console.log('This is the game room after first person');
            console.log(currentGameRoom);
            socket.emit('waiting');
        }

        // getSockets(io, socket)
        //     .then(sockets => {
        //         if (sockets.length > 0) {
        //             const socketToConnect = sockets[0];
        //             // joined = false;
        //             if (gameRooms.length > 0) {
        //                 for (const gameRoom of gameRooms) {
        //                     if (gameRoom.numOfPlayers < 2 && gameRoom.roomSocket.id !== reverseString(socket.id)) {
        //                         socket.join(gameRoom.roomSocket);
        //                         socket.searching = false;
        //                         gameRoom.numOfPlayers += 1;
        //                         room = gameRoom.roomSocket;
        //                         game = gameRoom.game;
        //                         console.log('This is my socket id');
        //                         console.log(socket.id);
        //                         console.log('This is the game room');
        //                         console.log(gameRoom);
        //                         console.log('This is the game');
        //                         console.log(game);
        //                         me = {...gamePlayer };
        //                         me.id = socket.id;
        //                         game.players.push(me);
        //                         io.to(room).emit('joined', game);
        //                         // joined = true;
        //                         for (const player of game.players) {
        //                             if (player.id === socket.id) {
        //                                 me = player;
        //                             } else {
        //                                 opponent = player;
        //                             }
        //                         }
        //                         game.deck = shuffle(cards);
        //                         console.log('This is the opponent');
        //                         console.log(opponent);
        //                         console.log('This is the game after pushing');
        //                         console.log(game);
        //                         opponentSocket = io.sockets.sockets.get(opponent.id);
        //                         dealCards(io, game, me, opponent, room, socket, opponentSocket);
        //                         break;
        //                     }
        //                 }
        //             } else {
        //                 currentGameRoom = {...gameRoom };
        //                 game = {...gameState };
        //                 // console.log("This is the first socket's id");
        //                 // console.log(typeof socket.id);
        //                 currentGameRoom.roomSocket = reverseString(socket.id);
        //                 currentGameRoom.game = game;
        //                 room = currentGameRoom.roomSocket;
        //                 socket.searching = false;
        //                 me = {...gamePlayer };
        //                 me.id = socket.id;
        //                 game.players.push(me);
        //                 socket.join(room);
        //                 currentGameRoom.numOfPlayers += 1;
        //                 gameRooms.push(currentGameRoom);
        //                 console.log('This is the game after first person');
        //                 console.log(game);
        //                 console.log('This is the game room after first person');
        //                 console.log(current);
        //             }
        //             // opponentSocket = io.sockets.sockets.get(socketToConnect);
        //             // opponentSocket.searching = false;
        //             // // socket.searching = false;
        //             // // me = {...gamePlayer };
        //             // opponent = {...gamePlayer };
        //             // me.id = socket.id
        //             // opponent.id = opponentSocket.id;
        //             // game = {...gameState };
        //             // game.players.push(me, opponent);
        //             // currentGameRoom = {...gameRoom };
        //             // currentGameRoom.numOfPlayers = game.players.length;
        //             // // currentGameRoom.roomSocket = `${socket.id.slice(0, socket.id.length/2)}+${opponentSocket.id.slice(opponentSocket.id.length/2)}`
        //             // // currentGameRoom.roomSocket = reverseString(socket.id);
        //             // currentGameRoom.game = game;
        //             // room = currentGameRoom.roomSocket;
        //             // currentPlayers.push(socket, opponentSocket);
        //             // console.log('current game');
        //             // console.log(game);

        //             // console.log(opponentSocket);
        //             // opponentSocket.emit('joined');
        //             // socket.emit('joined');
        //             // opponentSocket.searching = false;
        //             // socket.searching = false;
        //             // room = `${socket.id.slice(0, socket.id.length/2)}+${opponentSocket.id.slice(opponentSocket.id.length/2)}`
        //             // console.log(`${socket.id}\n${opponentSocket.id}\n${room}`);
        //             // opponentSocket.join(room);
        //             // socket.join(room);
        //             // currentPlayers.forEach(socket => socket.join(room));
        //             // console.log('joined');
        //             // io.to(room).emit('joined', game);
        //             // game.deck = shuffle(cards);
        //             // me.id = socket.id;
        //             // opponent.id = opponentSocket.id;
        //             // // console.log(game);
        //             // io.to(room).emit('game', game);

        //             // dealCards(io, game, me, opponent, room, socket, opponentSocket);
        //         };
        //     });
    });


    //Handle user hits and stand
    socket.on('stand', () => {
        socket.emit('hide buttons');

        // console.log('the type of the game object');
        // console.log(typeof game);
        // if (typeof game == 'object') {
        //     if (game.deck.length === 0) {
        //         console.log('The length of the game is zero');
        //     }
        // }
        // console.log(game);
        // console.log(game.players);
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
        // console.log('This is the game state');
        // console.log(game);
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

        // console.log('the type of the game object');
        // console.log(typeof game);
        // if (typeof game == 'object') {
        //     if (game.deck.length === 0) {
        //         console.log('The length of the game is zero');
        //     }
        // }
        /*
         Set me and opponent to their respective player objects in the game object 
        */
        for (const player of game.players) {
            if (player.id === socket.id) {
                me = player;
            } else {
                opponent = player;
            };
        };
        // console.log('This is the game state');
        // console.log(game);
        /*
        Set the opponent socket to socket that belongs to the other player 
        */
        for (const player of currentPlayers) {
            if (player.id !== socket.id) {
                opponentSocket = player;
            };
        };
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
        // socket.leave(room);
        // opponentSocket.leave(room);
        // room = null;
        // opponentSocket = null;
        // currentPlayers.pop(socket);
        gameRooms = roomsWithoutgameRoom(socket, gameRooms);

        // game = null;

        // if (currentPlayers.length < 1){
        //     room = null;
        // }
        // if (currentPlayers.length > 0) {
        //     socket.leave(room);
        //     currentPlayers.pop(socket);
        // } else {
        //     room = null;
        //     currentPlayers = [];
        // }
        // if (!room) {
        //     game = null;
        //     [me, opponent] = [null, null];
        // }

        console.log('game over', game);
    });

});





server.listen(PORT, () => {
    console.log(`The server has been started on port: ${PORT}`);
});