import { IncomingMessage, ServerResponse } from 'http';
import {Server, Socket} from 'socket.io';
import { socketSearchHandler } from './controllers/socketEventHandlers';
import { createPlayer } from './controllers/playerController';

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
    });

    
    return io;
}
