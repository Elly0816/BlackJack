import { IncomingMessage, ServerResponse } from 'http';
import {Server, Socket} from 'socket.io';
import { socketReadyHandler, socketSearchHandler } from './controllers/socketEventHandlers';
import { createPlayer, removePlayerOnDisconnect } from './controllers/playerController';
import { Player } from './classes/playerClass';

export function initializeSocket(server:Server<typeof IncomingMessage, typeof ServerResponse>|any){
    const io = new Server(server, {cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }});

    io.on('connection', (socket:Socket) => {
        const player = createPlayer(socket.id, socket);

        // socket.on('disconnect', () => {
        //     player
        // });

        socket.on('search', async (arg:string) => {
            try{
                await socketSearchHandler(arg as string, player, io);
            }catch(e){
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
        socket.on('ready', ({socketId, gameId}:{socketId:string, gameId:string}) => {
            // Check if all the players in the room is ready
            if(!socketId && !gameId){
                console.log(`You did not give any arguments`);
            }
            socketReadyHandler(socketId, gameId, io);

        })

        socket.on('disconnect', () => {
            console.log(`Disconnected: ${player.getName()}`);
            socket.disconnect(true);
            removePlayerOnDisconnect(player);
            /*
                TODO
                // Mechanism to check if the player is in a game resolving that game for the other players in it. 
            
            */

            console.log(`Remaining players are:\n`);
            Player.players.forEach(p => console.log(`${p.getName()}\n`));
        })
    });

    
    return io;
}
