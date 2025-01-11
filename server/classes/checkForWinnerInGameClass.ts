import { Server } from 'socket.io';
import BlackJack from './gameClass';
import { Dealer, Player } from './playerClass';
import Card from './cardClass';
import { getGameAsString } from '../utilities/utilities';

enum WinStateType {
  BLACKJACK = 'blackjack',
  DRAW = 'draw',
  HOUSE = 'houseWins',
  WINNER = 'winner',
  BUST = 'bust',
  LOSE = 'lose',
}
export default class CheckWinner {
  private game: BlackJack;
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
      .filter((p) => p.getTotal() <= this.MAXTOTAL)
      .reduce((initialPlayer, currentPlayer) => {
        return currentPlayer.getTotal() > initialPlayer.getTotal() ? currentPlayer : initialPlayer;
      })
      .getTotal();

    if (!gameMaxTotal) {
      this.players.map((p) => p.getSocket()?.emit(WinStateType.BUST));
    }

    for (const p of this.players) {
      // if (!CheckWinner.SEEN.includes(p)) {
      if (p.getTotal() === this.MAXTOTAL) {
        console.log(`${p.getName()}: ${WinStateType.BLACKJACK}`);
        p.getSocket()?.emit(WinStateType.BLACKJACK);
      }

      if (p.getTotal() > gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.BUST}`);
        p.getSocket()?.emit(WinStateType.BUST);
      }

      if (
        this.dealer.getTotal() === this.MAXTOTAL ||
        (this.dealer.getTotal() > gameMaxTotal && this.dealer.getTotal() <= this.MAXTOTAL)
      ) {
        console.log(`Dealer total is: ${this.dealer.getTotal()}\n ${WinStateType.HOUSE}`);
        this.io.to(this.game.getGameId()).emit(WinStateType.HOUSE);
      }

      // if([this.dealer.getTotal(), ...this.players.map(p => p.getTotal())].every(t => t>game))

      if (p.getTotal() === gameMaxTotal && this.dealer.getTotal() < gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.WINNER}`);
        p.getSocket()?.emit(WinStateType.WINNER);
      }

      if (p.getTotal() < gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.LOSE}`);
        p.getSocket()?.emit(WinStateType.LOSE);
      }
    }
  }
}
