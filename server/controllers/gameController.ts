import { Player } from '../classes/playerClass';
import BlackJack from '../classes/gameClass';
import { parseDeck } from '../utilities/utilities';
import gameManager from '../classes/gameManager';
import { Server } from 'socket.io';

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

  const desiredNumberOfPlayers = 2;
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
  // .filter(p => (p.getSocket()?.id != player.getSocket()?.id))){
  //     playersToAddToGame.push(p);
  // if(new Set(playersToAddToGame).size == desiredNumberOfPlayers){
  //     break;
  // }
  // }

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
