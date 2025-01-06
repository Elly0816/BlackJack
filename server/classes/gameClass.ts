import { Dealer, Player } from './playerClass';
import Card from './cardClass';

export default class BlackJack {
  private players: Player[];
  private deck: Card[];
  private static numberOfGames: number = 0;
  private id: string;
  private dealer: Dealer;
  private static games: BlackJack[] = [];

  constructor(players: Player[], deck: Card[], id: string) {
    this.players = players;
    this.dealer = new Dealer('Dealer: ' + id);
    this.deck = deck;
    this.id = id;
    BlackJack.games.push(this);
    BlackJack.numberOfGames = BlackJack.games.length;
  }

  static getGame(id: string): BlackJack {
    const game = BlackJack.games.filter((g) => g.id === id)[0];

    return game;
  }

  static getGames(): BlackJack[] {
    return BlackJack.games;
  }

  getNumberOfGames(): number {
    return BlackJack.numberOfGames;
  }

  getGameId(): string {
    return this.id;
  }

  shuffleCards(): void {
    this.dealer.shuffleCards(this.deck);
  }

  dealCards(n: number = 1): void {
    try {
      if (this.deck.length < 1) {
        // this.checkForBlackJack();
        console.log('Not enough cards in the deck');
        throw new Error('Not enough cards in the deck');
      }

      for (let i = 0; i < n; i++) {
        this.dealer.addCard(this.deck.pop() as unknown as Card);
        for (let i = 0; i < this.players.length; i++) {
          this.players[i].addCard(this.deck.pop() as unknown as Card);
        }
      }
    } catch (e) {
      // this.checkForBlackJack();
      console.log(e);
    }
  }

  static checkIsRemoved(game: BlackJack | null): boolean {
    if (!game) {
      BlackJack.numberOfGames--;
      return true;
    } else {
      return false;
    }
  }

  getDealer(): Dealer {
    return this.dealer;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getDeck(): Card[] {
    return this.deck;
  }
}
