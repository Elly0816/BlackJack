//Whole deck of cards
const cards = ['10_C.png', '10_D.png', '10_H.png', '10_S.png', '2_C.png', '2_D.png', '2_H.png', '2_S.png', '3_C.png', '3_D.png', '3_H.png', '3_S.png', '4_C.png', '4_D.png', '4_H.png', '4_S.png', '5_C.png', '5_D.png', '5_H.png', '5_S.png', '6_C.png', '6_D.png', '6_H.png', '6_S.png', '7_C.png', '7_D.png', '7_H.png', '7_S.png', '8_C.png', '8_D.png', '8_H.png', '8_S.png', '9_C.png', '9_D.png', '9_H.png', '9_S.png', 'ace_C.png', 'ace_D.png', 'ace_H.png', 'ace_S.png', 'jack_C.png', 'jack_D.png', 'jack_H.png', 'jack_S.png', 'king_C.png', 'king_D.png', 'king_H.png', 'king_S.png', 'queen_C.png', 'queen_D.png', 'queen_H.png', 'queen_S.png'];



const gameState = {
    deck: [],
    dealer: { cards: [], backCard: true, total: null },
    players: []
};

const gameRoom = {
    roomSocket: null,
    game: null,
    numOfPlayers: 0,
    idsInRoom: []
};

const gamePlayer = {
    id: null,
    cards: [],
    lastPlay: null,
    total: null
}


module.exports = {
    cards,
    gameState,
    gameRoom,
    gamePlayer
}