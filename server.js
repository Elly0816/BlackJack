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

//Whole deck of cards
const cards = ['10_C.png', '10_D.png', '10_H.png', '10_S.png', '2_C.png', '2_D.png', '2_H.png', '2_S.png', '3_C.png', '3_D.png', '3_H.png', '3_S.png', '4_C.png', '4_D.png', '4_H.png', '4_S.png', '5_C.png', '5_D.png', '5_H.png', '5_S.png', '6_C.png', '6_D.png', '6_H.png', '6_S.png', '7_C.png', '7_D.png', '7_H.png', '7_S.png', '8_C.png', '8_D.png', '8_H.png', '8_S.png', '9_C.png', '9_D.png', '9_H.png', '9_S.png', 'ace_C.png', 'ace_D.png', 'ace_H.png', 'ace_S.png', 'jack_C.png', 'jack_D.png', 'jack_H.png', 'jack_S.png', 'king_C.png', 'king_D.png', 'king_H.png', 'king_S.png', 'queen_C.png', 'queen_D.png', 'queen_H.png', 'queen_S.png'];


//Websocket

io.on('connection', (socket) => {
    // console.log(socket);
    let room;
    let otherPlayer;
    let myCards = [];
    let opponentCards = [];
    let dealerCards = [];
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
                if (single.connected && single.search && single.id !== socket.id) {
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

    //Listen for connection request
    socket.on('toConnect', (arg) => {
        console.log(`I want to connect to ${arg}`);
        async function getOtherSocket() {
            const connectedSocketsList = [];
            const connectedSockets = await io.fetchSockets();
            // console.log(`get other sockets just ran ${connectedSockets}`);
            for (single of connectedSockets) {
                connectedSocketsList.push(single);
            }
            return connectedSocketsList;
        };

        getOtherSocket().then((connectedSockets) => {
            // console.log(`Then method of getOtherSockets promise ${connectedSockets}`);
            for (connectedSocket of connectedSockets) {
                console.log(connectedSocket.id, arg);
                if (connectedSocket.id === arg) {
                    room = `${socket}${arg}`;
                    console.log(`This is the room ${room}`);
                    console.log('joined');
                    otherPlayer = connectedSocket;
                    otherPlayer.join(room);
                    socket.join(room);
                    otherPlayer.search = false;
                    socket.search = false;
                    io.to(room).emit('joined');
                    setTimeout(() => {
                        const shuffled = shuffle(cards);
                        io.to(room).emit('shuffled', shuffled);
                    }, 500);
                    break;
                }
            }
        });

    });

});



server.listen(5000, () => {
    console.log(`Listening on port: 5000`);
});


function shuffle(cards) { //This shuffles the deck
    let shuffled = cards
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffled;
};

// function dealCards(){//Draw two cards for the player and one for the dealer
//   setToDeal(false);
//   setNumInDeck(imageList.length);
//   let dealerCardList = [...dealerCards]; //Holds the dealer cards for use in loop
//   for(let i=0; i<2; i++){
//     dealerCardList.push(deck.pop());
//     setDeck(deck.slice(0, deck.length));
//     setNumInDeck(deck.length);
//   };
//   // console.log(`DealerCardList: ${dealerCardList}`);
//   setDealerCards([...dealerCardList]);
//   setBackCard(true);
//   // setNumOfDealerCards(dealerCardList.length);

//   let playerCardList = [...playerCards]; //Holds the player cards for use in loop
//   for (let i=0; i<2; i++){
//     playerCardList.push(deck.pop());
//     setDeck(deck.slice(0, deck.length));
//     setNumInDeck(deck.length);
//   };
//   // console.log(`PlayerCardList: ${playerCardList}`);
//   setPlayerCards([...playerCardList]);
//   // setNumOfPlayerCards(playerCardList.length);