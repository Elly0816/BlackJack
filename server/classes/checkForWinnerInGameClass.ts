import { Server, Socket } from 'socket.io';
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
  private readonly Max = 10;
  private readonly Min = 1;

  constructor(game: BlackJack, io: Server) {
    this.io = io;
    this.game = game;
    this.dealer = game.getDealer();
    this.players = game.getPlayers();
  }

  dealerBet(): void {
    this.io.to(this.game.getGameId()).emit('face-up');
  }

  private shouldDealerHit(maxGameTotal: number, randNum: number): boolean {
    const dealerTotal = this.dealer.getTotal();
    const potentialTotal = dealerTotal + randNum;
    const isWinningWithNewCard = maxGameTotal < potentialTotal;
    const willNotBust = potentialTotal < this.MAXTOTAL;
    const isCurrentlyLosing = dealerTotal < maxGameTotal;

    return isWinningWithNewCard && willNotBust && isCurrentlyLosing;
  }
  dealerUntilBust(): void {
    const randNum = Math.floor(Math.random() * (this.Max - this.Min + 1)) + this.Min;
    // const randNum = 1;
    const maxGameTotal = this.players
      .reduce((initialPlayer, currentPlayer) => {
        return currentPlayer.getTotal() > initialPlayer.getTotal() ? currentPlayer : initialPlayer;
      })
      .getTotal();

    while (this.shouldDealerHit(maxGameTotal, randNum)) {
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

  checkWinState(): void {
    const gameMaxTotal = this.players
      .reduce((initialPlayer, currentPlayer) => {
        return currentPlayer.getTotal() > initialPlayer.getTotal() ? currentPlayer : initialPlayer;
      })
      .getTotal();

    for (const p of this.players) {
      if (p.getTotal() > this.MAXTOTAL && this.dealer.getTotal() < this.MAXTOTAL) {
        p.getSocket()?.emit('bust');
      }

      if (
        p.getTotal() === gameMaxTotal &&
        p.getTotal() > this.dealer.getTotal() &&
        p.getTotal() < this.MAXTOTAL
      ) {
        p.getSocket()?.emit('winner');
      }

      if (this.dealer.getTotal() > gameMaxTotal && this.dealer.getTotal() < this.MAXTOTAL) {
        this.io.to(this.game.getGameId()).emit('house-wins');
      }

      if (p.getTotal() > this.MAXTOTAL && this.dealer.getTotal() > this.MAXTOTAL) {
        this.io.to(this.game.getGameId()).emit('draw');
      }

      if (p.getTotal() === this.MAXTOTAL) {
        if (this.dealer.getTotal() !== this.MAXTOTAL) {
          p.getSocket()?.emit('BlackJack');
        }
      }
    }
  }
}
