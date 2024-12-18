import { IncomingMessage, ServerResponse } from 'http';
import {Server, Socket} from 'socket.io';

export function initializeSocket(server:Server<typeof IncomingMessage, typeof ServerResponse>|any){
    const io = new Server(server, {cors: {

        origin: '*',
        methods: ['GET', 'POST']
    }});

    io.on('connection', (socket:Socket) => {
        console.log(`IO connected successfully`);

        socket.on('seaarch', () => {
            console.log('Client is searching');
        });
    });

    
    return io;
}
