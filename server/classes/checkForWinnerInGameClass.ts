import { Server } from 'socket.io';
import BlackJack from './gameClass';
import { Dealer, Player } from './playerClass';
import Card from './cardClass';
import { getGameAsString } from '../utilities/utilities';

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

  dealerUntilBust(): void {
    const min = 1;
    const max = 10;
    // const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const randNum = 1;
    const maxGameTotal = this.game
      .getPlayers()
      .reduce((max, player) => {
        return player.getTotal() > max.getTotal() ? player : max;
      })
      .getTotal();

    while (
      this.dealer.getTotal() + randNum < this.MAXTOTAL &&
      this.dealer.getTotal() < maxGameTotal
    ) {
      this.dealer.addCard(this.game.getDeck().pop() as unknown as Card);
      // this.io.to(this.game.getGameId()).emit('')
      this.io.to(this.game.getGameId()).emit('dealer', getGameAsString(this.game));
    }

    /**
     *
     * Check to see who the winner is
     *
     *
     */
  }
}
