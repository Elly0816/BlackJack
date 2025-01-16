import { IncomingMessage, ServerResponse } from 'http';
import { Server, Socket } from 'socket.io';
import {
  endGameHandler,
  socketHitHandler,
  socketReadyHandler,
  socketSearchHandler,
  // socketShowHandler,
  socketStandHandler,
} from './controllers/socketEventHandlers';
import { createPlayer, removePlayerOnDisconnect } from './controllers/playerController';
import { Player } from './classes/playerClass';
import BlackJack from './classes/gameClass';

export function initializeSocket(
  server: Server<typeof IncomingMessage, typeof ServerResponse> | any
) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    const player = createPlayer(socket.id, socket);
    console.log('Connected: ' + socket.id);

    socket.on('search', async (arg: string) => {
      try {
        await socketSearchHandler(arg as string, player, io);
      } catch (e) {
        player.setStatus('notInGame');
        socket.emit('search error');
      }
    });

    // A ready event is emitted by each client in the game
    /*
            Ideally, when they have recieved the initial game,
            they each click a ready button which emits a 
            ready even to the server, this should also have the game Id
        
        */
    socket.on('ready', async ({ socketId, gameId }: { socketId: string; gameId: string }) => {
      // Check if all the players in the room is ready
      console.log(
        `Listened to the ready event and the socketid is: ${socketId}\nAnd the gameId is:${gameId}`
      );
      if (!socketId && !gameId) {
        console.log(`You did not give any arguments`);
      }
      await socketReadyHandler(socketId, gameId, io);
    });

    socket.on('hit', async (gameId: string) => {
      if (!gameId) {
        console.log(`You need to ass a game Id`);
      }
      console.log('The socket heard a hit event');
      await socketHitHandler(gameId, socket.id, io);
      //Logic for handling hits
    });

    socket.on('stand', async (gameId: string) => {
      if (!gameId) {
        console.log(`You need to ass a game Id`);
      }
      console.log('The socket heard a stand event');
      await socketStandHandler(gameId, socket.id, io);

      //Logic for handling stand
    });

    // socket.on('show', (gameId: string) => {
    //   socketShowHandler(gameId, io);
    // });

    socket.on('end game', (gameId: string) => {
      endGameHandler(gameId, socket.id);
      console.log(`Below is the game in memory`);
      console.log(BlackJack.getGames());
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${player.getName()}`);
      socket.disconnect(true);
      removePlayerOnDisconnect(player);
      /*
                TODO
                // Mechanism to check if the player is in a game resolving that game for the other players in it. 
            
            */

      console.log(`Remaining players are:\n`);
      Player.getPlayers().forEach((p) => console.log(`${p.getName()}\n`));
    });
  });

  return io;
}
