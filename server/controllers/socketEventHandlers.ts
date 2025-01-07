import { Server } from 'socket.io';
import BlackJack from '../classes/gameClass';
import { cleanupTimers, getGameAsString } from '../utilities/utilities';
import {
  checkForWinner,
  createdGameAndReturnId,
  nextPlayerTurn,
  playerChoiceController,
} from './gameController';
import { Player } from '../classes/playerClass';
import gameManager from '../classes/gameManager';
import CheckWinner from '../classes/checkForWinnerInGameClass';

export async function socketSearchHandler(arg: string, player: Player, io: Server) {
  if (!arg) {
    console.log('No arguments provided');
    return;
  }
  //useTimeout here
  const duration = 1000;
  const timeout = 10000;
  let interval: NodeJS.Timeout;
  let timeout_: NodeJS.Timeout;

  interval = setInterval(async () => {
    if (player.getStatus() == 'notInGame') {
      try {
        const createdGameid = await createdGameAndReturnId(player, arg);
        if (createdGameid) {
          console.log(
            `Game created successfully by ${player.getName()} and the game id is ${createdGameid}`
          );
          const game = BlackJack.getGame(createdGameid);
          console.log(`The players in the game are:\n\ `);
          game.getPlayers().forEach((p) => console.log(`${p.getName()}\n`));

          io.to(String(createdGameid)).emit('game', getGameAsString(game));
          cleanupTimers([interval, timeout_]);
        } else {
          console.log('Failed to create game');
        }
      } catch (e) {
        console.log(`There was an error creating the game.`);
      }
    } else {
      cleanupTimers([interval, timeout_]);
    }
  }, duration);
  // while (player.getStatus() == 'online'){
  console.log(`Client is searching and the argument given was:\n ${JSON.stringify(arg)}`);

  timeout_ = setTimeout(() => {
    gameManager.removeSearchingPlayers(player);
    console.log(`Player was removed from the searching list\n`);
    gameManager.getSearchingPlayers().forEach((p) => console.log(p.getName()));
    player.getSocket()?.emit('search error');
    player.setStatus('notInGame');
    cleanupTimers([interval, timeout_]);
  }, timeout);
}

export async function socketReadyHandler(
  socketId: string,
  gameId: string,
  io: Server
): Promise<void> {
  if (!socketId || !gameId || !io) {
    return;
  }

  const gameAndAllPlayersReady = gameManager.checkIfAllPlayersAreReady(socketId, gameId);
  if (gameAndAllPlayersReady) {
    const { game } = gameAndAllPlayersReady;
    game.shuffleCards();
    game.dealCards(2);
    io.to(gameId).emit('shuffle', getGameAsString(game));
    await nextPlayerTurn(gameId, io);
  }
}

export async function socketHitHandler(gameId: string, socketId: string, io: Server) {
  await playerChoiceController(gameId, socketId, io, 'hit');
}

export async function socketStandHandler(gameId: string, socketId: string, io: Server) {
  await playerChoiceController(gameId, socketId, io, 'stand');
}

export function socketShowHandler(gameId: string, io: Server) {
  console.log('This is the gameID:\n' + gameId);
  // const gameToCheckForWinner = new CheckWinner(BlackJack.getGame(gameId), io);
  // gameToCheckForWinner.dealerBet();
  // gameToCheckForWinner.checkWinState()
  checkForWinner(BlackJack.getGame(gameId), io);
}
