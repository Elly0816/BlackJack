const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const path = require('path');


app.use(cors());

const PORT = process.env.PORT || 5000;

server = http.Server(app);

// io = socketIO(server, {
//     cors: {
//         origin: process.env.CLIENT, 
//         methods: ["GET", "POST"]
//     }
// });

io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//Whole deck of cards
const cards = ['10_C.png', '10_D.png', '10_H.png', '10_S.png', '2_C.png', '2_D.png', '2_H.png', '2_S.png', '3_C.png', '3_D.png', '3_H.png', '3_S.png', '4_C.png', '4_D.png', '4_H.png', '4_S.png', '5_C.png', '5_D.png', '5_H.png', '5_S.png', '6_C.png', '6_D.png', '6_H.png', '6_S.png', '7_C.png', '7_D.png', '7_H.png', '7_S.png', '8_C.png', '8_D.png', '8_H.png', '8_S.png', '9_C.png', '9_D.png', '9_H.png', '9_S.png', 'ace_C.png', 'ace_D.png', 'ace_H.png', 'ace_S.png', 'jack_C.png', 'jack_D.png', 'jack_H.png', 'jack_S.png', 'king_C.png', 'king_D.png', 'king_H.png', 'king_S.png', 'queen_C.png', 'queen_D.png', 'queen_H.png', 'queen_S.png'];


//Websocket

io.on('connection', (socket) => {
    let room;
    console.log(`A connection has been made with socket id: ${socket.id}`);
    const game = {
        deck: [],
        dealer: [],
        players: [{ id: null, cards: [], lastPlay: null },
            { id: null, cards: [], lastPlay: null }
        ]
    };
    let [me, opponent] = game.players;

    //When the socket has been disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected.`);
    });


    //When the user searches for another socket to connect to 
    socket.on('search', () => {
        //Set the socket's searching property to true
        socket.searching = true;
        //Get all the connected and searching sockets
        async function getSockets() {
            const socketIds = [];
            const sockets = (await io.fetchSockets())
                .filter(other => other.connected === true)
                .filter(other => other.searching === true)
                .filter(other => other.id !== socket.id)
                .map(other => other.id);
            sockets.map(socket => socketIds.push(socket));
            return socketIds;
        };
        // Create a room and add both sockets to it 
        getSockets().then(sockets => {
            if (sockets.length > 0) {
                const socketToConnect = sockets[0];
                const opponentSocket = io.sockets.sockets.get(socketToConnect);
                opponentSocket.searching = false;
                socket.searching = false;
                // console.log(opponentSocket);
                // opponentSocket.emit('joined');
                // socket.emit('joined');
                opponentSocket.searching = false;
                socket.searching = false;
                room = `${socket.id.slice(0, socket.id.length/2)}+${opponentSocket.id.slice(opponentSocket.id.length/2)}`
                console.log(`${socket.id}\n${opponentSocket.id}\n${room}`);
                opponentSocket.join(room);
                socket.join(room);
                io.to(room).emit('joined', game);
                game.deck = [...shuffle(cards)];
                me.id = socket.id;
                opponent.id = opponentSocket.id;
                console.log(game);
                io.to(room).emit('game', game);

                //Set timer to seal cards to player and dealer
                const dealCards = setTimeout(() => {
                    setTimeout(() => {
                        game.dealer.push(game.deck.pop());
                        io.to(room).emit('game state', game);
                        setTimeout(() => {
                            me.cards.push(game.deck.pop());
                            io.to(room).emit('game state', game);
                            setTimeout(() => {
                                opponent.cards.push(game.deck.pop());
                                io.to(room).emit('game state', game);
                                setTimeout(() => {
                                    game.dealer.push(game.deck.pop());
                                    io.to(room).emit('game state', game);
                                    setTimeout(() => {
                                        me.cards.push(game.deck.pop());
                                        io.to(room).emit('game state', game);
                                        setTimeout(() => {
                                            opponent.cards.push(game.deck.pop());
                                            io.to(room).emit('game state', game);
                                            socket.emit('show buttons');
                                            opponentSocket.emit('hide buttons');
                                            clearTimeout(dealCards);
                                        }, 1000);
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        }, 2000);
                    });
                });
            };
        });
    });


    //Handle user hits and stand
    socket.on('stand', () => {
        socket.emit('hide buttons');
        me.lastPlay = 'stand';
        if (opponent.lastPlay === 'stand') {

        }
    });


});





server.listen(PORT, () => {
    console.log(`A connection has been made with the server on port: ${PORT}`);
});


function shuffle(cards) { //This shuffles the deck
    let shuffled = cards
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffled;
};