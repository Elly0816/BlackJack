import { Socket } from 'socket.io-client';
import { connectedSocket } from '../Socket';

export type EventsToEmit = 'search' | 'ready';

export default class Emitter {
  private socket: Socket = connectedSocket;

  static instance: Emitter;

  private constructor() {}

  static getInstance(): Emitter {
    if (!Emitter.instance) {
      Emitter.instance = new Emitter();
      return Emitter.instance;
    }
    return Emitter.instance;
  }

  search(name: string): void {
    this.socket.emit('search', name);
  }

  ready(gameId: string): void {
    this.socket.emit('ready', { socketId: this.socket.id, gameId: gameId });
  }
}
