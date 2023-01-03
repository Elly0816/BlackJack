function shuffle(cards) { //This shuffles the deck
    let shuffled = cards
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return shuffled;
};

// function checkWin(dealer, playerOne, playerTwo) {

// }



function countCards(cardList, firstBack = false) {
    let cardsToCount = [...cardList];
    // console.log('These are the cards');
    // console.log(cardsToCount);
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



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};



async function calculateWinner(game, me, opponent, socket, opponentSocket, room, io) {
    console.log('calculating win');
    game.dealer.backCard = false;
    // game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
    let myTotal = countCards(me.cards);
    let opponentTotal = countCards(opponent.cards);
    let dealerTotal = countCards(game.dealer.cards);
    await sleep(1000);
    io.to(room).emit('game state', game);
    io.to(room).emit('hide buttons');
    while (dealerTotal < 17) {
        console.log('This is the game in function line 71');
        console.log(game);
        game.dealer.cards.push(game.deck.pop());
        console.log(game);
        dealerTotal = countCards(game.dealer.cards, game.dealer.backCard);
        game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
        await sleep(1000);
        io.to(room).emit('game state', game);
    };
    if (dealerTotal > 21) {
        game.dealer.total = 'Bust';
        await sleep(2000);
        io.to(room).emit('game state', game);
        io.to(room).emit('go home');
    } else if (dealerTotal === 21) {
        game.dealer.total = 'BlackJack';
        await sleep(2000);
        io.to(room).emit('game state', game);
        io.to(room).emit('go home');
    } else if (dealerTotal < myTotal || dealerTotal < opponentTotal) {
        if (myTotal > opponentTotal) {
            socket.emit('you win');
            opponentSocket.emit('you lose');
        } else if (myTotal < opponentTotal) {
            opponentSocket.emit('you win');
            socket.emit('you lose');
        } else {
            io.to(room).emit('house looses');
        }
        io.to(room).emit('game state', game);
    }
    io.to(room).emit('game state', game);
    await sleep(1000);
    io.to(room).emit('go home');
};

function getSocket(io, id) {
    return io.sockets.sockets.get(id);
}



async function dealCards(io, gameRoom) {
    let game = gameRoom.game;
    let room = gameRoom.roomSocket;
    console.log('This is the room in the deal Cards function');
    console.log(room);
    console.log('This is the game in the deal cards function');
    console.log(game);
    for (let i = 0; i < 2; i++) {
        await sleep(1000);
        game.dealer.cards.push(game.deck.pop());
        game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
        io.to(room).emit('game state', game);
        game.players.forEach(async player => {
                await sleep(1000);
                player.cards.push(game.deck.pop());
                player.total = countCards(player.cards);
                io.to(room).emit('game state', game);
            })
            // await sleep(1000);
            // console.log('This is the game in function line 104');
            // console.log(game);
            // game.dealer.cards.push(game.deck.pop());
            // console.log(game);
            // game.dealer.total = countCards(game.dealer.cards, game.dealer.backCard);
            // io.to(room).emit('game state', game);
            // await sleep(1000);
            // console.log('This is the game in function line 110');
            // console.log(game);
            // me.cards.push(game.deck.pop());
            // console.log(game);
            // me.total = countCards(me.cards);
            // io.to(room).emit('game state', game);
            // await sleep(1000);
            // console.log('This is the game in function line 116');
            // console.log(game);
            // opponent.cards.push(game.deck.pop());
            // console.log(game);
            // opponent.total = countCards(opponent.cards);
            // io.to(room).emit('game state', game);
    }


    // let sockets = [];

    // game.players.map(player => {
    //     console.log('This is a single socket');
    //     console.log(socket);
    //     sockets.push(getSocket(player.id));
    // });


    let playerToPlay;

    if (game.players.every((player) => {
            player.total < 21;
        })) {
        getSocket(game.players[0].id).emit('show buttons');
        for (let i = 1; i < game.players.length; i++) {
            getSocket(game.players[i].emit('hide buttons'));
        }
    } else {
        game.players.forEach(player => {
            if (player.total === 21) {
                player.total = 'BlackJack';
                getSocket(player.id).emit('hide buttons');
            } else if (player.total > 21) {
                player.total = 'Bust';
                getSocket(player.id).emit('hide buttons');
            };
        });

    }



    // let myTotal = countCards(me.cards);
    // let opponentTotal = countCards(opponent.cards);

    // if (myTotal === 21 || opponentTotal === 21) {
    //     if (me.total === 21) {
    //         me.total = 'BlackJack';
    //         socket.emit('hide buttons');
    //         if (opponentTotal !== 21) {
    //             opponentSocket.emit('show buttons');
    //         };
    //     };
    //     if (opponentTotal === 21) {
    //         opponent.total = 'BlackJack';
    //         opponentSocket.emit('hide buttons');
    //         if (myTotal !== 21) {
    //             socket.emit('show buttons');
    //         };
    //     };

    //     if (myTotal === 21 && opponentTotal === 21) {
    //         calculateWinner(game, me, opponent, socket, opponentSocket, room, io, sleep);
    //     };
    // };
    // if (myTotal !== 21 && opponentTotal !== 21) {
    //     socket.emit('show buttons');
    //     opponentSocket.emit('hide buttons');
    // }
    // io.to(room).emit('game state', game);
}



// async function getSockets(io, socket) {
//     const socketIds = [];
//     const sockets = (await io.fetchSockets())
//         .filter(other => other.connected === true)
//         .filter(other => other.searching === true)
//         .filter(other => other.id !== socket.id)
//         .map(other => other.id);
//     sockets.map(socket => socketIds.push(socket));
//     return socketIds;
// };

function reverseString(string) {

    return string.split("").reverse().join("");
}

function roomsWithoutgameRoom(socket, gameRooms) {
    let roomToRemove;
    let roomsToReturn = gameRooms;
    for (let gameRoom of roomsToReturn) {
        console.log(gameRoom);
        if (gameRoom.idsInRoom.includes(socket.id)) {
            roomToRemove = gameRoom.roomSocket;
            socket.leave(gameRoom.roomSocket);
            gameRoom.idsInRoom = gameRoom.idsInRoom.filter(id => id !== socket.id);
            gameRoom.numOfPlayers -= 1;
            if (gameRoom.numOfPlayers === 0) {
                roomsToReturn = roomsToReturn.filter(gameRoom => {
                    gameRoom.roomSocket !== roomToRemove;
                });
            };
            break;
        }
    }
    return roomsToReturn;
}


module.exports = {
    shuffle,
    countCards,
    calculateWinner,
    dealCards,
    reverseString,
    roomsWithoutgameRoom
};