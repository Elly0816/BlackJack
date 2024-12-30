import BlackJack from "./gameClass";
import { Player, PlayerReadyTracker } from "./playerClass";

export default class gameManager {
  private static searchingPlayers: Player[] = [];

  private constructor() {}

  static getSearchingPlayers(): Player[] {
    for (const p of Player.players) {
      if (p.getStatus() == "searching") {
        gameManager.searchingPlayers.push(p);
      }
    }
    return gameManager.searchingPlayers;
  }

  static removeSearchingPlayers(player: Player): void {
    const indexOfPlayerToRemove = this.searchingPlayers.indexOf(player);
    if (indexOfPlayerToRemove > -1) {
      console.log(`Removing ${player.getName()}`);
      this.searchingPlayers.splice(indexOfPlayerToRemove, 1);
    }
  }

  static checkIfAllPlayersAreReady(
    playerId: string,
    gameId: string,
  ): { game: BlackJack; allPlayersReady: boolean } | undefined {
    let game: BlackJack | null = null;
    let player: Player | null = null;
    let tracker: PlayerReadyTracker | null = null;
    for (const g of BlackJack.games) {
      if (g.getGameId() == gameId) {
        game = g;
        break;
      }
    }
    for (const p of Player.players) {
      if (p.getSocket()?.id == playerId) {
        player = p;
        break;
      }
    }
    if (game && player) {
      tracker = new PlayerReadyTracker(player, game);
      const playersReady = tracker.checkIfAllPlayersAreReady();
      if (playersReady) {
        return {
          game: game,
          allPlayersReady: true,
        };
      }
    }
    return;
  }
}
