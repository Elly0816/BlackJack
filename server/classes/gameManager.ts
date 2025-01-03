import BlackJack from './gameClass';
import { Player, PlayerReadyTracker } from './playerClass';

type getPlayerTurnType = {
  gameId: string;
  playerTurn: {
    playerId: string;
    isTurn: boolean;
    lastMove: 'hit' | 'stand' | null;
    currentRound: number;
  }[];
};

export default class gameManager {
  private static searchingPlayers: Player[] = [];

  private static getPlayerTurn: getPlayerTurnType[] = [];

  private constructor() {}

  static getSearchingPlayers(): Player[] {
    for (const p of Player.players) {
      if (p.getStatus() == 'searching' && !gameManager.searchingPlayers.includes(p)) {
        gameManager.searchingPlayers.push(p);
      }
    }
    return gameManager.searchingPlayers;
  }

  static removeSearchingPlayers(player: Player): void {
    const indexOfPlayerToRemove = gameManager.searchingPlayers.indexOf(player);
    if (indexOfPlayerToRemove > -1) {
      console.log(`Removing ${player.getName()}`);
      gameManager.searchingPlayers.splice(indexOfPlayerToRemove, 1);
    }
  }

  static checkIfAllPlayersAreReady(
    playerId: string,
    gameId: string
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

  /*
    For this method, remember to remove the game from the array when it's over.
    Or else you would have a memory problem
  
  */
  static decidePlayerTurn(gameID: string): getPlayerTurnType {
    console.log(`Deciding`);
    let game = BlackJack.games.filter((b) => b.getGameId() === gameID)[0];
    // if(gameManager.getPlayerTurn.length === 0){
    //   gameManager.getPlayerTurn.push({gameId:gameID, playerTurn:game.getPlayers().map((p,i) => {return {playerId:p.getSocket()?.id as unknown as string, isTurn:(i=0)?true:false}})});

    // }

    let gameToCheckForTurn = gameManager.getPlayerTurn.filter((g) => g.gameId === gameID)[0];
    if (!gameToCheckForTurn) {
      gameToCheckForTurn = {
        gameId: gameID,
        playerTurn: game.getPlayers().map((p, i) => {
          return {
            playerId: p.getSocket()?.id as unknown as string,
            isTurn: i === 0 ? true : false,
            currentRound: 0,
            lastMove: null,
          };
        }),
      };
      gameManager.getPlayerTurn.push(gameToCheckForTurn);

      // gameToCheckForTurn = gameManager.getPlayerTurn.filter(g => g.gameId === gameID)[0]
      console.log(`Game to check for turn\n`);
      console.log(gameToCheckForTurn);
      return gameToCheckForTurn;
      // gameToCheckForTurn.playerTurn.forEach((p, i) => {
      //   if(p.isTurn){

      //   }
      // })
    }
    // else {
    let currentPlayer = gameToCheckForTurn.playerTurn.filter((p) => p.isTurn)[0];
    let currentIndex = gameToCheckForTurn.playerTurn.indexOf(currentPlayer);
    /*
        Current player is whoever is to play. On first try, that should be the
        first person in the array of current players. When someone hits/stands, 
        move the current player to the next index, if you're at the last index,
        move it back to the first index
        
        */
    if (currentIndex === gameToCheckForTurn.playerTurn.length - 1) {
      for (const p of gameToCheckForTurn.playerTurn) {
        if (gameToCheckForTurn.playerTurn.indexOf(p) === 0) {
          p.isTurn = true;
        } else {
          p.isTurn = false;
        }
      }
      console.log(`Game to check for turn\n`);
      console.log(gameToCheckForTurn);
      return gameToCheckForTurn;
    }
    // else {
    for (const p of gameToCheckForTurn.playerTurn) {
      if (gameToCheckForTurn.playerTurn.indexOf(p) === currentIndex + 1) {
        p.isTurn = true;
      } else {
        p.isTurn = false;
      }
    }
    console.log(`Game to check for turn\n`);
    console.log(gameToCheckForTurn);
    return gameToCheckForTurn;
    // }
    // }
  }

  static gameCanContinue(playerId: string, gameId: string, choice: 'hit' | 'stand'): boolean {
    const playerObject = Player.players.filter((p) => p.getSocket()?.id === playerId)[0];

    if (playerObject.getTotal() >= 21 && playerObject.getCards().length > 2) {
      return false;
    }

    /*
        Implement checking player win in here, define functions in game Controller to check for the game state
        
        HINT: Along with all below, check if all players have played for that round and that everyone hit;
        Only then should this return true. 
        
        
        
        
        */

    const gameFromManager = gameManager.getPlayerTurn.filter((p) => p.gameId === gameId)[0];
    const player = gameFromManager.playerTurn.filter((p) => p.playerId === playerId)[0];

    player.lastMove = choice;
    player.currentRound++;

    return true;
  }
}
