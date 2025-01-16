import { Socket } from 'socket.io';
import Card from './cardClass';
import BlackJack from './gameClass';

export type playerStatusType = 'inGame' | 'searching' | 'notInGame';

export class Player {
  private playerName: string;
  private playerCards: Card[];
  private playerTotal: number;
  protected readonly playerSocket: Socket | null;
  private static players: Player[] = [];
  protected status: playerStatusType;

  constructor(playerName: string, socket: Socket | null) {
    this.playerName = playerName;
    this.playerCards = [];
    this.playerTotal = 0;
    this.playerSocket = socket;
    this.status = 'notInGame';
    if (this.constructor === Player) {
      Player.players.push(this);
    }
  }

  static getPlayers(): Player[] {
    return Player.players;
  }

  static getPlayer(id: string): Player {
    const player = Player.players.filter((p) => p.getSocket()?.id === id)[0];
    return player;
  }

  getStatus(): playerStatusType {
    return this.status;
  }

  setStatus(status: playerStatusType): void {
    this.status = status;
  }

  addCard(card: Card): Card[] {
    this.playerCards.push(card);
    this.updateTotal();
    return this.getCards();
  }

  private updateTotal(): void {
    let total: number = 0;
    for (let i: number = 0; i < this.playerCards.length; i++) {
      total += this.playerCards[i].getCardDetails().number;
    }

    if (
      total + 10 <= 21 &&
      this.playerCards.map(
        (card) =>
          card.getCardDetails()['face'].toLowerCase().includes('ace') &&
          card.getCardDetails().number === 1
      )
    ) {
      total += 10;
      this.playerCards
        .find((value: Card) => {
          return (
            value.getCardDetails().face.toLowerCase() === 'ace' &&
            value.getCardDetails().number === 1
          );
        })
        ?.setAceToEleven();
    }

    this.playerTotal = total;
  }

  getSocket(): Socket | null {
    return this.playerSocket;
  }

  getTotal(): number {
    return this.playerTotal;
  }

  getCards(): Card[] {
    return this.playerCards;
  }

  getName(): string {
    return this.playerName;
  }

  setName(name: string): void {
    this.playerName = name;
  }

  reset(): void {
    this.playerCards = [];
    this.playerName = '';
    this.playerTotal = 0;
  }
}

export class Dealer extends Player {
  constructor(playerName: string) {
    super(playerName, null);
    this.status = 'inGame';
  }

  shuffleCards(cards: Card[]): void {
    if (!cards || cards.length <= 1) return;
    for (let i = cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * cards.length);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  dealCards(cards: Card[], player: Player): void {
    player.addCard(cards.pop() as unknown as Card);
  }
}

export class PlayerReadyTracker {
  private game: BlackJack;
  private static readyPlayersId: string[] = [];

  constructor(player: Player, game: BlackJack) {
    this.game = game;
    if (!PlayerReadyTracker.readyPlayersId.includes(player.getSocket()?.id as unknown as string)) {
      if (player.getSocket()) {
        PlayerReadyTracker.readyPlayersId.push(player.getSocket()?.id as unknown as string);
      }
    }
  }

  removePlayersFromTracker(): void {
    const playersToRemove = this.game.getPlayers().map((p) => p.getSocket()?.id);
    PlayerReadyTracker.readyPlayersId = PlayerReadyTracker.readyPlayersId.filter(
      (p) => !playersToRemove.includes(p)
    );
  }

  checkIfAllPlayersAreReady(): boolean {
    const currentReady = new Set(PlayerReadyTracker.readyPlayersId);
    const gamePlayersIds = this.game.getPlayers().map((p) => p.getSocket()?.id);
    if (gamePlayersIds.every((p) => currentReady.has(p as string))) {
      this.removePlayersFromTracker();
      return true;
    }
    return false;
  }
}
