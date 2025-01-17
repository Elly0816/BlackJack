import { Socket } from 'socket.io-client';
import { connectedSocket } from '../Socket';

export type EventsToEmit = 'search' | 'ready';

export default class Emitter {
  private socket: Socket = connectedSocket;

  static instance: Emitter | null;

  private constructor() {}

  static getInstance(): Emitter {
    if (!Emitter.instance) {
      Emitter.instance = new Emitter();
      return Emitter.instance;
    }
    return Emitter.instance;
  }

  static removeEmitter(): void {
    if (Emitter.instance) {
      Emitter.instance = null;
    }
  }

  search(name: string): void {
    this.socket.emit('search', name);
  }

  ready(gameId: string): void {
    this.socket.emit('ready', { socketId: this.socket.id, gameId: gameId });
  }

  hit(gameId: string): void {
    this.socket.emit('hit', gameId);
  }

  stand(gameId: string): void {
    this.socket.emit('stand', gameId);
  }

  show(gameId: string) {
    this.socket.emit('show', gameId);
  }

  resetGame(gameId: string) {
    this.socket.emit('end game', gameId);
  }
}
