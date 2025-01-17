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

// type playerForCheckWinner = Player & { isChecked: boolean };
export default class CheckWinner {
  private game: BlackJack;
  private dealer: Dealer;
  // private players: playerForCheckWinner[];
  private players: Player[];
  private static readonly MAXTOTAL: number = 21;
  private io: Server;
  private readonly Max = 10;
  private readonly Min = 1;

  constructor(game: BlackJack, io: Server) {
    this.io = io;
    this.game = game;
    this.dealer = game.getDealer();
    this.players = game.getPlayers();
    // .map((p) => {
    //   console.log(`Player: ${p.getName()}`);
    //   return Object.assign(p, { isChecked: false });
    // });
  }

  dealerBet(): void {
    this.io.to(this.game.getGameId()).emit('face-up');
  }

  private shouldDealerHit(maxGameTotal: number, randNum: number): boolean {
    const dealerTotal = this.dealer.getTotal();
    const potentialTotal = dealerTotal + randNum;
    const isWinningWithNewCard = maxGameTotal < potentialTotal;
    const willNotBust = potentialTotal < CheckWinner.MAXTOTAL;
    const isCurrentlyLosing = dealerTotal < maxGameTotal;

    return isWinningWithNewCard && willNotBust && isCurrentlyLosing;
  }
  dealerUntilBust(): void {
    const randNum = Math.floor(Math.random() * (this.Max - this.Min + 1)) + this.Min;
    // const randNum = 1;
    const maxGameTotal = this.players
      .reduce((initialPlayer, currentPlayer) => {
        // console.log('Current Player:\n');
        // console.log(currentPlayer.getTotal());
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
    let gameMaxTotal: Player | number | Player[] = this.players.filter(
      (p) => p.getTotal() <= CheckWinner.MAXTOTAL
    );

    if (gameMaxTotal.length === 0) {
      gameMaxTotal = this.dealer.getTotal();
    } else {
      gameMaxTotal = gameMaxTotal
        .reduce((initialPlayer, currentPlayer) => {
          {
            console.log(`Initial Player:\n`);
            console.log(
              initialPlayer.getName(),
              initialPlayer.getCards(),
              initialPlayer.getTotal()
            );
            console.log(`\nCurrent Player:\n`);
            console.log(
              currentPlayer.getName(),
              currentPlayer.getCards(),
              currentPlayer.getTotal()
            );
            return currentPlayer.getTotal() >= initialPlayer.getTotal()
              ? currentPlayer
              : initialPlayer;
          }
        })
        .getTotal();
    }
    // gameMaxTotal = Number(gameMaxTotal);

    // if (gameMaxTotal === 0) {
    //   this.players.forEach((p) => {
    //     console.log(`Busting for ${p.getName()} because gameMax is: ${gameMaxTotal}`);
    //     p.getSocket()?.emit(WinStateType.BUST);
    //     continue;
    //   });
    // }

    for (const p of this.players) {
      // if (!CheckWinner.SEEN.includes(p)) {
      console.log('The first check state for ' + p.getName() + ' is: \n' + '');
      console.log('The dealer total is: ' + this.dealer.getTotal());
      console.log('The player total is: ' + p.getTotal());
      if (this.dealer.getTotal() === gameMaxTotal && p.getTotal() === gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.DRAW}\n and the check state is: ${''}`);
        p.getSocket()?.emit(WinStateType.DRAW);
        continue;
      }
      if (p.getTotal() === CheckWinner.MAXTOTAL) {
        console.log(`${p.getName()}: ${WinStateType.BLACKJACK}\n and the check state is: ${''}`);
        p.getSocket()?.emit(WinStateType.BLACKJACK);
        continue;
      }

      if (p.getTotal() > gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.BUST}\n and the check state is: ${''}`);
        p.getSocket()?.emit(WinStateType.BUST);
        continue;
      }

      if (
        this.dealer.getTotal() === CheckWinner.MAXTOTAL ||
        (this.dealer.getTotal() > gameMaxTotal && this.dealer.getTotal() <= CheckWinner.MAXTOTAL)
      ) {
        console.log(
          `Dealer total is: ${this.dealer.getTotal()}\n ${
            WinStateType.HOUSE
          }\n and the check state is: ${''}`
        );
        this.io.to(this.game.getGameId()).emit(WinStateType.HOUSE);
        continue;
      }

      // if([this.dealer.getTotal(), ...this.players.map(p => p.getTotal())].every(t => t>game))

      if (p.getTotal() === gameMaxTotal && this.dealer.getTotal() < gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.WINNER}\n and the check state is: ${''}`);
        p.getSocket()?.emit(WinStateType.WINNER);
        continue;
      }

      if (p.getTotal() < gameMaxTotal) {
        console.log(`${p.getName()}: ${WinStateType.LOSE}\n and the check state is: ${''}`);
        p.getSocket()?.emit(WinStateType.LOSE);
        continue;
      }
    }
  }
}
