import { Server } from 'socket.io';
import BlackJack from './gameClass';
import { Dealer, Player } from './playerClass';

export default class CheckWinner {
  private game: BlackJack;
  private winner: Player | Dealer | null = null;
  private dealer: Dealer;
  private players: Player[];
  private readonly MAXTOTAL: number = 21;
  private io: Server;

  constructor(game: BlackJack, io: Server) {
    this.io = io;
    this.game = game;
    this.dealer = game.getDealer();
    this.players = game.getPlayers();
  }

  dealerBet(): void {
    this.io.to(this.game.getGameId()).emit('face-up');
  }
}
