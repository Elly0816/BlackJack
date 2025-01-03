const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
// const async = require('async');
const path = require("path");

app.use(cors());

const PORT = process.env.PORT || 5000;

// app.use(express.static(path.join(__dirname, 'client/build')));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

server = http.Server(app);
// server.listen(5000);

// io = socketIO(server, {
//     cors: {
//         origin: process.env.CLIENT,
//         methods: ["GET", "POST"]
//     }
// });

io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//Whole deck of cards
const cards = [
  "10_C.png",
  "10_D.png",
  "10_H.png",
  "10_S.png",
  "2_C.png",
  "2_D.png",
  "2_H.png",
  "2_S.png",
  "3_C.png",
  "3_D.png",
  "3_H.png",
  "3_S.png",
  "4_C.png",
  "4_D.png",
  "4_H.png",
  "4_S.png",
  "5_C.png",
  "5_D.png",
  "5_H.png",
  "5_S.png",
  "6_C.png",
  "6_D.png",
  "6_H.png",
  "6_S.png",
  "7_C.png",
  "7_D.png",
  "7_H.png",
  "7_S.png",
  "8_C.png",
  "8_D.png",
  "8_H.png",
  "8_S.png",
  "9_C.png",
  "9_D.png",
  "9_H.png",
  "9_S.png",
  "ace_C.png",
  "ace_D.png",
  "ace_H.png",
  "ace_S.png",
  "jack_C.png",
  "jack_D.png",
  "jack_H.png",
  "jack_S.png",
  "king_C.png",
  "king_D.png",
  "king_H.png",
  "king_S.png",
  "queen_C.png",
  "queen_D.png",
  "queen_H.png",
  "queen_S.png",
];

//Websocket

game = {
  deck: [],
  dealer: [],
  players: [
    { id: null, cards: [], lastPlay: null },
    { id: null, cards: [], lastPlay: null },
  ],
};

io.on("connection", (socket) => {
  // game.deck = [];
  // game.dealer = [];
  // game = {
  //     deck: [],
  //     dealer: [],
  //     players: [{ id: null, cards: [], lastPlay: null },
  //         { id: null, cards: [], lastPlay: null }
  //     ]
  // };
  let { deck, dealer, players } = game;

  let [me, opponent] = players;
  // me.cards = [];
  // opponent.cards = [];

  room = null;
  otherPlayer = null;

  shuffled = null;
  cardsHaveBeenShuffled = null;

  console.log(`The client connected to the socket on id: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    game = {
      deck: [],
      dealer: [],
      players: [
        { id: null, cards: [], lastPlay: null },
        { id: null, cards: [], lastPlay: null },
      ],
    };
  });
  //When socket is searching for user
  socket.on("search", () => {
    //Variable to store the other player
    socket.search = true;

    async function getSockets() {
      const ids = [];
      const sockets = await io.fetchSockets();
      for (single of sockets) {
        if (single.connected && single.search && single.id !== socket.id) {
          ids.push(single.id);
        }
      }
      // console.log(ids);
      return ids;
    }

    getSockets().then((res) => {
      socket.emit("sockets", res);
      // console.log('sockets');
    });

    //Set duration for search to last

    // console.log(`endtime: ${endSearch}\n startTime: ${startSearch}`);
    //If time is up and a room was created
  });

  //Listen for connection request
  socket.on("toConnect", (arg) => {
    async function getOtherSocket() {
      // console.log(`I want to connect to ${arg}`);
      const connectedSocketsList = [];
      const connectedSockets = await io.fetchSockets();
      // console.log(`get other sockets just ran ${connectedSockets}`);
      for (single of connectedSockets) {
        if (single.search && single.id !== socket.id) {
          connectedSocketsList.push(single);
        }
      }
      return connectedSocketsList;
    }

    getOtherSocket()
      .then((connectedSockets) => {
        // console.log(`Then method of getOtherSockets promise ${connectedSockets}`);
        for (const connectedSocket of connectedSockets) {
          // console.log(connectedSocket.id, arg);
          if (connectedSocket.id === arg && arg.search && socket.search) {
            room = `${socket.id.split("").slice(0, 10)}++${arg.split("").slice(10)}`;
            // console.log(`This is the room ${room}`);
            otherPlayer = connectedSocket;
            if (!socket.rooms.has(room)) {
              otherPlayer.search = false;
              socket.search = false;
              socket.join(room);
              otherPlayer.join(room);
              me.id = socket.id;
              opponent.id = otherPlayer.id;
              // console.log('both joined');
              io.to(room).emit("joined");
              // console.log(`${socket.id} and ${otherPlayer.id} joined room ${room}`);
              let timerToShuffle = setTimeout(() => {
                deck.push(...shuffle(cards));
                io.to(room).emit("shuffled", deck);
                // console.log(`cards have been shuffled: ${deck}`)
                clearTimeout(timerToShuffle);
              }, 500);
            }
            break;
          }
        }
      })
      .then(() => {
        let timerToDeal = setTimeout(() => {
          if (
            otherPlayer.rooms.has(room) &&
            socket.rooms.has(room) &&
            !otherPlayer.search &&
            !socket.search
          ) {
            for (let i = 0; i < 2; i++) {
              dealer.push(deck.pop());
              // console.log(dealerCards)
              me.cards.push(deck.pop());
              // console.log(myCards);
              opponent.cards.push(deck.pop());
              // console.log(opponentCards);
              // console.log(shuffled);
            }

            console.log(`before emitting to the room:`);
            console.log(game);
            io.to(room).emit("game state", game);
            //socket.emit("game state", game);
            for (const player of game.players) {
              // console.log(game);
              if (player.id !== socket.id) {
                io.sockets.sockets.get(player.id).emit("hide buttons");
              }
            }
            clearTimeout(timerToDeal);
          }
        }, 2000);
      });
  });

  //socket receives player 21 and socket id from client
  socket.on("player 21", (arg) => {
    if (arg === socket.id) {
      game.dealer.push(game.deck.pop());
      for (const player of game.players) {
        if (player.id !== socket.id) {
          player.cards = [];
          break;
        }
      }
      io.to(room).emit("game state", game);
    }
  });

  socket.on("both stand", () => {
    game.dealer.push(game.deck.pop());
    io.to(room).emit("game state", game);
  });

  //player hits
  socket.on("hit", (arg) => {
    for (const player of game.players) {
      if (player.id === socket.id) {
        player.cards.push(game.deck.pop());
        break;
      }
    }
    if (opponent.lastPlay === "stand") {
      me.lastPlay = "stand";
    }
    io.to(room).emit("game state", game);
    for (const player of game.players) {
      if (player.id === socket.id) {
        player.lastPlay = "hit";
      }
      if (player.id !== socket.id) {
        io.sockets.sockets.get(player.id).emit("show buttons");
      }
    }
    // console.log(`game: ${game}`);
  });

  //player stands
  socket.on("stand", () => {
    //If the other player's last play is stand or the other player has no cards, emit game state
    io.to(room).emit("game state", game);
    console.log("stand");
    for (const player of game.players) {
      if (player.id === socket.id) {
        player.lastPlay = "stand";
      }
      if (player.id !== socket.id) {
        if (player.lastPlay === "stand" || player.cards.length === 0) {
          io.to(room).emit("game state", game);
        } else {
          io.sockets.sockets.get(player.id).emit("show buttons");
        }
      }
    }
  });

  socket.on("over 21", () => {
    for (const player of game.players) {
      if (player.id === socket.id) {
        player.cards = [];
        break;
      }
    }
    io.to(room).emit("game state", game);
  });

  socket.on("both bust", () => {
    game.dealer.push(game.deck.pop());
    io.to(room).emit("game state", game);
  });

  socket.on("reset", () => {
    game.deck = [];
    game.dealer = [];
    me.id = null;
    me.cards = [];
    me.lastPlay = null;
    opponent.id = null;
    opponent.cards = [];
    opponent.lastPlay = null;
  });
}); //End of socket obj

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"), (err) => {
    res.status(500).send(err);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port: 5000`);
});

function shuffle(cards) {
  //This shuffles the deck
  let shuffled = cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffled;
}

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

/* 
                        THIS SHOULD BE THE STRUCTURE OF THE PAYLOAD DURING THE GAME
                    */
// game = {
//     deck: shuffled,
//     dealer: dealerCards,
//     players: [{
//             id: socket.id,
//             cards: myCards,
//             lastPlay: null
//         },
//         {
//             id: otherPlayer.id,
//             cards: opponentCards,
//             lastPlay: null
//         }
//     ]
// }
