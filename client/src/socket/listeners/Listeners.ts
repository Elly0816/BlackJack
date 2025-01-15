import { Socket } from 'socket.io-client';
import { connectedSocket } from '../Socket';

// blackjack
// * draw
// * houseWins
// * winner
// * bust
// * lose

export type GameScoreType =
  | 'draw'
  | 'houseWins'
  | 'winner'
  | 'bust'
  | 'lose'
  | 'blackjack';

export default class Listener {
  private socket: Socket = connectedSocket;
  static instance: Listener | null;

  private constructor() {}

  static getInstance(): Listener {
    if (Listener.instance) {
      return Listener.instance;
    }
    Listener.instance = new Listener();
    return Listener.instance;
  }

  static removeListener(): void {
    if (Listener.instance) {
      Listener.instance = null;
    }
  }

  game(cb: (game: string) => void): void {
    this.socket.on('game', cb);
  }

  shuffle(cb: (game: string) => void): void {
    this.socket.on('shuffle', cb);
  }

  searchError(cb: () => void): void {
    this.socket.on('search error', cb);
  }

  show(cb: () => void): void {
    this.socket.on('show', cb);
    // console.log(`Socket heard a show event`);
  }

  hide(cb: () => void): void {
    this.socket.on('hide', cb);
    // console.log(`Socket heard a hide event`);
  }

  score(cb: (game: string) => void): void {
    this.socket.on('scoreGame', cb);
  }

  faceUp(cb: () => void): void {
    this.socket.on('face-up', cb);
  }

  dealer(cb: (game: string) => void): void {
    this.socket.on('dealer', cb);
  }

  blackJack(cb: (blackJackState: GameScoreType) => void): void {
    this.socket.on('blackjack', cb);
  }

  draw(cb: (drawState: GameScoreType) => void): void {
    this.socket.on('draw', cb);
  }

  houseWins(cb: () => void): void {
    this.socket.on('houseWins', cb);
  }

  winner(cb: () => void): void {
    this.socket.on('winner', cb);
  }

  bust(cb: () => void): void {
    this.socket.on('bust', cb);
  }

  lose(cb: () => void): void {
    this.socket.on('lose', cb);
  }

  /**
   * blackjack
   * draw
   * houseWins
   * winner
   * bust
   * lose
   */
}
