function shuffle(cards) {
  //This shuffles the deck
  let shuffled = cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffled;
}

function countCards(cardList, firstBack = false) {
  let cardsToCount = [...cardList];
  // console.log('These are the cards');
  // console.log(cardsToCount);
  const values = {
    //Object that holds the values of each card
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
    king: 10,
  };
  let cardValues = []; //Array that holds the value on each card
  if (firstBack) {
    cardsToCount = cardsToCount.splice(1, 1);
  }
  for (const card of cardsToCount) {
    const value = card.split("_")[0];
    cardValues.push(value);
  }
  let total = 0;
  for (const value of cardValues) {
    total += values[value];
  }
  if (total > 21 && cardValues.includes("ace")) {
    total -= 10;
  } else if (total + 11 <= 21 && cardValues.includes("ace")) {
    total += 10;
  }
  return total;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function calculateWinner(
  game,
  me,
  opponent,
  socket,
  opponentSocket,
  room,
  io,
) {
  console.log("calculating win");
  game.dealer.backCard = false;
  // game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
  let myTotal = countCards(me.cards);
  let opponentTotal = countCards(opponent.cards);
  let dealerTotal = countCards(game.dealer.cards, game.dealer.backCard);
  game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
  await sleep(1000);
  io.to(room).emit("game state", game);
  io.to(room).emit("hide buttons");
  while (dealerTotal < 17) {
    console.log("This is the game in function line 71");
    console.log(game);
    game.dealer.cards.push(game.deck.pop());
    console.log(game);
    dealerTotal = countCards(game.dealer.cards, game.dealer.backCard);
    game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
    await sleep(1000);
    io.to(room).emit("game state", game);
  }
  if (dealerTotal > 21) {
    game.dealer.total = "Bust";
    await sleep(2000);
    io.to(room).emit("game state", game);
    io.to(room).emit("go home");
  } else if (dealerTotal === 21) {
    game.dealer.total = "BlackJack";
    await sleep(2000);
    io.to(room).emit("game state", game);
    io.to(room).emit("go home");
  } else if (dealerTotal < myTotal || dealerTotal < opponentTotal) {
    if (myTotal > opponentTotal) {
      socket.emit("you win");
      opponentSocket.emit("you lose");
    } else if (myTotal < opponentTotal) {
      opponentSocket.emit("you win");
      socket.emit("you lose");
    } else {
      io.to(room).emit("house looses");
    }
    io.to(room).emit("game state", game);
  }
  io.to(room).emit("game state", game);
  await sleep(1000);
  io.to(room).emit("go home");
}

function getSocket(io, id) {
  if (id) {
    console.log("This is the socket id");
    console.log(id);
    return io.sockets.sockets.get(id);
  }
}

async function dealCards(io, gameRoom) {
  // console.log('This is the game room in the deal cards function');
  // console.log(gameRoom);
  let { game } = gameRoom;
  let room = gameRoom.roomSocket;
  let { dealer, deck, players } = game;
  for (let i = 0; i < 2; i++) {
    dealer.cards.push(deck.pop());
    dealer.total = countCards(dealer.cards, dealer.backCard);
    await sleep(1000).then(() => {
      io.to(room).emit("game state", game);
    });

    players.forEach(async (player) => {
      player.cards.push(deck.pop());
      player.total = countCards(player.cards);
      await sleep(1000).then(() => {
        io.to(room).emit("game state", game);
      });
    });
  }
  /*
        Let the first player in the array
        whose total is less than 21 play
        all players who's total is 21 or over 
        should be permanently on have hide buttons 
        emitted
    */

  for (let i = 0; i < players.length; i++) {
    if (players[i].total < 21) {
      getSocket(io, players[i].id).emit("show buttons");
      players.slice(i, players.length - 1).map((player) => {
        getSocket(io, player.id).emit("show buttons");
      });
      break;
    }
  }
}

function reverseString(string) {
  return string.split("").reverse().join("");
}

function roomsWithoutgameRoom(socket, currentRooms) {
  let idToRemove = socket.id;
  let gameRooms = [...currentRooms];
  for (let room of gameRooms) {
    if (room.idsInRoom.includes(idToRemove)) {
      room.idsInRoom = room.idsInRoom.filter((id) => id != idToRemove);
      console.log("These are the ids in the room after filter");
      console.log(room.idsInRoom);
      room.numOfPlayers = room.idsInRoom.length;
    }
    if (room.numOfPlayers === 0) {
      gameRooms = gameRooms.filter(
        (room) => room.roomSocket != room.roomSocket,
      );
    }

    break;
  }
  return gameRooms;
}

module.exports = {
  shuffle,
  countCards,
  calculateWinner,
  dealCards,
  reverseString,
  roomsWithoutgameRoom,
  getSocket,
};
