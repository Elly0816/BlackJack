import { Player } from '../classes/playerClass';
import BlackJack from '../classes/gameClass';
import { cleanupTimers, getGameAsString, parseDeck } from '../utilities/utilities';
import gameManager from '../classes/gameManager';
import { Server } from 'socket.io';
import Card from '../classes/cardClass';
import { numberOfPlayers } from '../config';
import CheckWinner from '../classes/checkForWinnerInGameClass';

// Create a game with the player and return the gameID
export async function createdGameAndReturnId(
  player: Player,
  arg: string
): Promise<BlackJack['id'] | undefined> {
  let newGame: BlackJack | undefined = undefined;
  if (player.getStatus() == 'inGame') {
    return newGame;
  }
  const name = arg;
  player.setName(name);
  player.setStatus('searching');

  const desiredNumberOfPlayers = numberOfPlayers;
  let playersToAddToGame: Player[] = [player];

  const availablePlayers = gameManager.getSearchingPlayers().filter(
    (p) => p.getSocket()?.id != player.getSocket()?.id
    //  &&
    //   p.getStatus() != "inGame",
  );

  for (const p of availablePlayers) {
    if (playersToAddToGame.length >= desiredNumberOfPlayers) break;
    playersToAddToGame.push(p);
  }

  if (new Set(playersToAddToGame).size < desiredNumberOfPlayers) {
    player.setStatus('notInGame');
    return newGame;
  }

  console.log(`Creating new BlackJack game`);
  newGame = new BlackJack(
    Array.from(new Set(playersToAddToGame)),
    await parseDeck(),
    player.getSocket()?.id as string
  );

  if (newGame) {
    // player.setStatus('inGame');
    playersToAddToGame.forEach((p) => {
      console.log(`${p.getName()}:\n has a status of ${p.getStatus()}`);
      p.setStatus('inGame');
      gameManager.removeSearchingPlayers(p);
      p.getSocket()?.join(String(newGame?.getGameId()));
    });
    console.log('A new game has been created');
  } else {
    console.log('A new game was not created');
  }
  playersToAddToGame = [];
  return newGame?.getGameId();
}

export async function nextPlayerTurn(gameId: string, io: Server): Promise<void> {
  let playerTurns = gameManager.decidePlayerTurn(gameId);
  playerTurns ? console.log('There are player turns') : console.log('There are no player turns');
  let players = playerTurns.playerTurn;
  players ? console.log('There are players') : console.log('There are no players');
  let sockets = await io.in(gameId).fetchSockets();
  sockets ? console.log('There are sockets') : console.log('There are no sockets');
  for (const p of players) {
    if (p.isTurn) {
      io.to(sockets.filter((s) => s.id === p.playerId)[0].id).emit('show');
    } else {
      io.to(sockets.filter((s) => s.id === p.playerId)[0].id).emit('hide');
    }
  }
}

export async function playerChoiceController(
  gameId: string,
  socketId: string,
  io: Server,
  choice: 'hit' | 'stand'
): Promise<void> {
  const game = BlackJack.getGame(gameId);
  let player: Player | null = null;

  if (choice === 'hit') {
    player = game.getPlayers().filter((p) => p.getSocket()?.id === socketId)[0];
  }

  gameManager.setPlayerGameChoice(socketId, gameId, choice);
  if (gameManager.gameCanContinue(socketId, gameId)) {
    if (choice === 'hit') {
      player?.addCard(game.getDeck().pop() as unknown as Card);
    }
    await nextPlayerTurn(gameId, io);
    io.to(gameId).emit('game', getGameAsString(game));
  } else {
    if (choice === 'hit') {
      player?.addCard(game.getDeck().pop() as unknown as Card);
      io.to(gameId).emit('game', getGameAsString(game));
    }
    console.log(`Should deal to the dealer and check for the winner`);
    io.to(gameId).emit('scoreGame', getGameAsString(game));
    console.log(`Revealing dealer's second card`);
    io.to(gameId).emit('face-up');
    const timer = setTimeout(() => {
      console.log('This is the gameID:\n' + gameId);
      checkForWinner(BlackJack.getGame(gameId), io);
      cleanupTimers(timer);
    }, 500);

    // const timer2 = setTimeout(() => {
    //   io.to(gameId).emit();
    // }, 750)

    // checkForWinner(BlackJack.getGame(gameId), io);
    //Logic for fully dealing to the dealer and checking for the winner
  }
}

function checkForWinner(game: BlackJack, io: Server) {
  const gameWinner = new CheckWinner(game, io);
  gameWinner.dealerBet();
  gameWinner.dealerUntilBust();
  gameWinner.checkWinState();
}

export function removePlayerFromGame(gameId: string, playerId: string) {
  const game = BlackJack.getGame(gameId);
  if (game) {
    const player = Player.getPlayer(playerId);
    if (player && game.getPlayers().includes(player)) {
      game.removePlayer(playerId);
      player.reset();
      console.log('Below are the remaining players in the game\n');
      console.log(game.getPlayers());
    }
  }
}

export function removeGameFromMemory(gameId: string) {
  const game = BlackJack.getGame(gameId);
  if (game.getPlayers().length === 0) {
    game.removeGame();
    gameManager.removeGame(gameId);
  }
  // console.log('Below is the game in memory:\n');
  // console.log(game);
}
