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
let room;
let opponentSocket;
let game = {
    deck: [],
    dealer: { cards: [], backCard: true, total: null },
    players: [{ id: null, cards: [], lastPlay: null, total: null },
        { id: null, cards: [], lastPlay: null, total: null }
    ]
};
let [me, opponent] = game.players;

io.on('connection', (socket) => {
    console.log(`A connection has been made with socket id: ${socket.id}`);
    room = room;
    game = game;
    let [me, opponent] = game.players;

    function showGoHome(socket1, socket2, room, io = io) {
        setTimeout(() => {
            io.to(room).emit('go home');
            // socket1.leave(room);
            // socket2.leave(room);
            // room = null
            console.log('go home');
        }, 5000);
    };

    //When the socket has been disconnected
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected.`);
        room = null;
        opponentSocket = null;
        game = {
            deck: [],
            dealer: { cards: [], backCard: true, total: null },
            players: [{ id: null, cards: [], lastPlay: null, total: null },
                { id: null, cards: [], lastPlay: null, total: null }
            ]
        };
    });

    let currentPlayers = [];
    //When the user searches for another socket to connect to 
    socket.on('search', () => {
        //Set the socket's searching property to true
        game = game;
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
                opponentSocket = io.sockets.sockets.get(socketToConnect);
                currentPlayers = [socket, opponentSocket];
                opponentSocket.searching = false;
                socket.searching = false;
                // console.log(opponentSocket);
                // opponentSocket.emit('joined');
                // socket.emit('joined');
                opponentSocket.searching = false;
                socket.searching = false;
                room = `${socket.id.slice(0, socket.id.length/2)}+${opponentSocket.id.slice(opponentSocket.id.length/2)}`
                    // console.log(`${socket.id}\n${opponentSocket.id}\n${room}`);
                opponentSocket.join(room);
                socket.join(room);
                io.to(room).emit('joined', game);
                game.deck = [...shuffle(cards)];
                me.id = socket.id;
                opponent.id = opponentSocket.id;
                // console.log(game);
                io.to(room).emit('game', game);

                //Set timer to seal cards to player and dealer
                const dealCards = setTimeout(() => {
                    setTimeout(() => {
                        game.dealer.cards.push(game.deck.pop());
                        game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
                        io.to(room).emit('game state', game);
                        setTimeout(() => {
                            me.cards.push(game.deck.pop());
                            me.total = countCards(me.cards);
                            io.to(room).emit('game state', game);
                            setTimeout(() => {
                                opponent.cards.push(game.deck.pop());
                                opponent.total = countCards(opponent.cards);
                                io.to(room).emit('game state', game);
                                setTimeout(() => {
                                    game.dealer.cards.push(game.deck.pop());
                                    game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
                                    io.to(room).emit('game state', game);
                                    setTimeout(() => {
                                        me.cards.push(game.deck.pop());
                                        me.total = countCards(me.cards);
                                        if (me.total === 21) {
                                            me.total = 'BlackJack';
                                            socket.emit('hide buttons');
                                        }
                                        io.to(room).emit('game state', game);
                                        setTimeout(() => {
                                            opponent.cards.push(game.deck.pop());
                                            opponent.total = countCards(opponent.cards);
                                            if (opponent.total === 21) {
                                                opponent.total = 'BlackJack';
                                                opponentSocket.emit('hide buttons');
                                            }
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
        console.log(game);
        console.log(game.players);
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
        for (const player of currentPlayers) {
            if (player.id !== socket.id) {
                opponentSocket = player;
            };
        };
        me.lastPlay = 'stand';
        // console.log("Game: ", game);
        //If other player also stands
        if (opponent.lastPlay === 'stand' || opponent.total === 'BlackJack' || opponent.total === 'Bust') {
            setTimeout(() => {
                game.dealer.backCard = false;
                game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
                io.to(room).emit('game state', game);
                io.to(room).emit('hide buttons');
                const dealerDeal = setInterval(() => {
                    if (game.dealer.total < 17) {
                        game.dealer.cards.push(game.deck.pop());
                        game.dealer.total = countCards(game.dealer.cards);
                        io.to(room).emit('game state', game);
                    } else {
                        //Create a function to check the win (Dealers' cards are over 17)
                        if (game.dealer.total > 21) {
                            game.dealer.total = 'Bust';
                            io.to(room).emit('game state', game);
                            showGoHome(room = room, io = io);
                        } else if (game.dealer.total === 21) {
                            game.dealer.total = 'BlackJack';
                            io.to(room).emit('game state', game);
                            showGoHome(room = room, io = io);
                        } else if (game.dealer.total < me.total && game.dealer.total < opponent.total) {
                            if (me.total > opponent.total) {
                                socket.emit('you win');
                                opponentSocket.emit('other player wins');
                                showGoHome(room = room, io = io);
                            } else if (me.total < opponent.total) {
                                socket.emit('other player wins');
                                opponentSocket.emit('you win');
                                showGoHome(room = room, io = io);
                            } else {
                                io.to(room).emit('house looses');
                                showGoHome(room = room, io = io);
                            };
                        } else {
                            showGoHome(room = room, io = io);
                        }
                        clearInterval(dealerDeal);
                    };
                }, 1000);
            }, 1000);
            //If other player did not stand
        } else {
            // console.log(opponentSocket);
            opponentSocket.emit('show buttons');
        }
    });

    //When a player hits
    socket.on('hit', () => {
        for (const player of game.players) {
            if (player.id === socket.id) {
                me = player;
            } else {
                opponent = player;
            };
        };

        for (const player of currentPlayers) {
            if (player.id !== socket.player) {
                opponentSocket = player;
            };
        };
        me.lastPlay = 'hit';
        me.cards.push(game.deck.pop());
        total = countCards(me.cards);
        if (total === 21) {
            socket.emit('hide buttons');
            me.total = 'BlackJack';
            io.to(room).emit('game state', game);
            if (opponent.total === 'Bust' || opponent.total === 'BlackJack' || opponent.lastPlay === 'stand') {
                setTimeout(() => {
                    game.dealer.backCard = false;
                    game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
                    io.to(room).emit('game state', game);
                    io.to(room).emit('hide buttons');
                    const dealerDeal = setInterval(() => {
                        if (game.dealer.total < 17) {
                            game.dealer.cards.push(game.deck.pop());
                            game.dealer.total = countCards(game.dealer.cards);
                            io.to(room).emit('game state', game);
                            showGoHome(room = room, io = io);
                        } else {
                            //Create a function to check the win (Dealers' cards are over 17)
                            if (game.dealer.total > 21) {
                                game.dealer.total = 'Bust';
                                io.to(room).emit('game state', game);
                                showGoHome(room = room, io = io);
                            } else if (game.dealer.total === 21) {
                                game.dealer.total = 'BlackJack';
                                io.to(room).emit('game state', game);
                                showGoHome(room = room, io = io);
                            } else if (game.dealer.total < me.total && game.dealer.total < opponent.total) {
                                if (me.total > opponent.total) {
                                    socket.emit('you win');
                                    opponentSocket.emit('other player wins');
                                    showGoHome(room = room, io = io);
                                } else if (me.total < opponent.total) {
                                    socket.emit('other player wins');
                                    opponentSocket.emit('you win');
                                    showGoHome(room = room, io = io);
                                } else {
                                    io.to(room).emit('house looses');
                                    showGoHome(room = room, io = io);
                                };
                            };
                            clearInterval(dealerDeal);
                        };
                    }, 1000);
                }, 1000);
            } else {
                opponentSocket.emit('show buttons');
            }

        } else if (total > 21) {
            socket.emit('hide buttons');
            me.total = 'Bust';
            io.to(room).emit('game state', game);
            if (opponent.total === 'Bust' || opponent.total === 'BlackJack' || opponent.lastPlay === 'stand') {

                setTimeout(() => {
                    game.dealer.backCard = false;
                    game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
                    io.to(room).emit('game state', game);
                    io.to(room).emit('hide buttons');
                    const dealerDeal = setInterval(() => {
                        if (game.dealer.total < 17) {
                            game.dealer.cards.push(game.deck.pop());
                            game.dealer.total = countCards(game.dealer.cards);
                            io.to(room).emit('game state', game);
                        } else {
                            //Create a function to check the win (Dealers' cards are over 17)
                            if (game.dealer.total > 21) {
                                game.dealer.total = 'Bust';
                                io.to(room).emit('game state', game);
                            } else if (game.dealer.total === 21) {
                                game.dealer.total = 'BlackJack';
                                io.to(room).emit('game state', game);
                            } else if (game.dealer.total < me.total && game.dealer.total < opponent.total) {
                                if (me.total > opponent.total) {
                                    socket.emit('you win');
                                    opponentSocket.emit('other player wins');
                                    showGoHome(room = room, io = io);

                                } else if (me.total < opponent.total) {
                                    socket.emit('other player wins');
                                    opponentSocket.emit('you win');
                                    showGoHome(room = room), io = io;

                                } else {
                                    io.to(room).emit('house looses');
                                    showGoHome(room = room, io = io);

                                };
                            } else {
                                showGoHome(room = room, io = io);
                            };
                            clearInterval(dealerDeal);
                        };
                    }, 1000);
                }, 1000);
            } else {
                opponentSocket.emit('show buttons');
            }
        } else {
            me.total = total;
            io.to(room).emit('game state', game);
        };

    });


});





server.listen(PORT, () => {
    console.log(`The server has been started on port: ${PORT}`);
});




function shuffle(cards) { //This shuffles the deck
    let shuffled = cards
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffled;
};

function checkWin(dealer, playerOne, playerTwo) {

}

function countCards(cardList, firstBack = false) {
    let cardsToCount = [...cardList];
    const values = { //Object that holds the values of each card
        ace: 11,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        jack: 10,
        queen: 10,
        king: 10
    };
    let cardValues = []; //Array that holds the value on each card
    if (firstBack) {
        cardsToCount = cardsToCount.splice(1, 1);
    };
    for (const card of cardsToCount) {
        const value = card.split('_')[0];
        cardValues.push(value);
    };
    let total = 0;
    for (const value of cardValues) {
        total += values[value];
    };
    if (total > 21 && cardValues.includes('ace')) {
        total -= 10;
    } else if (total + 11 <= 21 && cardValues.includes('ace')) {
        total += 10;
    };
    return total;
};