import { Server } from 'socket.io';
import BlackJack from '../classes/gameClass';
import { cleanupTimers, getGameAsString } from '../utilities/utilities';
import { createdGameAndReturnId } from './gameController';
import { Player } from '../classes/playerClass';
import gameManager from '../classes/gameManager';

export async function socketSearchHandler(
  arg: string,
  player: Player,
  io: Server
) {
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
          const game = BlackJack.games.filter(
            (game) => game.getGameId() == createdGameid
          )[0];
          console.log(`The players in the game are:\n\ `);
          game.getPlayers().forEach((p) => console.log(`${p.getName()}\n`));

          io.to(String(createdGameid)).emit('game', getGameAsString(game));
          cleanupTimers([interval, timeout_]);
        } else {
          console.log('Failed to create game');
          // player.getSocket()?.emit('search error');

          // player.setStatus('notInGame');
          // cleanupTimers([interval, timeout_]);
        }
      } catch (e) {
        console.log(`There was an error creating the game.`);
        // player.getSocket()?.emit('search error');

        // player.setStatus('notInGame');
        // cleanupTimers([interval, timeout_]);
      }
    } else {
      cleanupTimers([interval, timeout_]);
    }
  }, duration);
  // while (player.getStatus() == 'online'){
  console.log(
    `Client is searching and the argument given was:\n ${JSON.stringify(arg)}`
  );

  timeout_ = setTimeout(() => {
    cleanupTimers([interval, timeout_]);
    player.getSocket()?.emit('search error');
    player.setStatus('notInGame');
  }, timeout);
}

export async function socketReadyHandler(
  socketId: string,
  gameId: string,
  io: Server
): Promise<void> {
  const gameAndAllPlayersReady = gameManager.checkIfAllPlayersAreReady(
    socketId,
    gameId
  );
  if (gameAndAllPlayersReady) {
    const { game } = gameAndAllPlayersReady;
    game.shuffleCards();
    game.dealCards(2);
    io.to(gameId).emit('shuffle', getGameAsString(game));

    let playerTurns = gameManager.decidePlayerTurn(gameId);
    let players = playerTurns.playerTurn;
    let sockets = await io.in(gameId).fetchSockets();
    for (const p of players) {
      if (p.isTurn) {
        io.to(sockets.filter((s) => s.id === p.playerId)[0].id).emit('show');
      } else {
        io.to(sockets.filter((s) => s.id === p.playerId)[0].id).emit('hide');
      }
    }
  }
}
