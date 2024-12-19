import { Player } from "../classes/playerClass";
import BlackJack from "../classes/gameClass";
import { parseDeck } from "../utilities/utilities";
import gameManager from "../classes/gameManager";

// const TIMEOUTFORSEARCH = 100;




// Create a game with the player and return the gameID
export async function createdGameAndReturnId(player:Player, arg:string):Promise<BlackJack['id']|undefined> 
{
    let newGame:BlackJack|undefined = undefined;
    if(player.getStatus() == 'inGame'){
        return newGame;
    }
    const name = arg;
    player.setName(name);
    player.setStatus('searching');

    const searchingPlayers:Player[] = gameManager.getSearchingPlayers();
    const desiredNumberOfPlayers = 2;
    const playersToAddToGame: Player[] = [player];
    let i = 0;
    
    while(playersToAddToGame.length < desiredNumberOfPlayers && searchingPlayers.length >= desiredNumberOfPlayers && i < searchingPlayers.length){
        if(searchingPlayers[i].getSocket()?.id != player.getSocket()?.id){
            playersToAddToGame.push(searchingPlayers[i]);
        }
        i++;
    }
   

    if(playersToAddToGame.filter(p => p.getSocket()?.id != player.getSocket()?.id).length > 0){
        console.log(`Creating new BlackJack game`);
        newGame = new BlackJack(playersToAddToGame, await parseDeck(), player.getSocket()?.id as string);
    }


    
    if (newGame){
        playersToAddToGame.forEach(p => p.setStatus('inGame')); 
        playersToAddToGame.forEach(p => p.getSocket()?.join(String(newGame?.getGameId())));
        console.log('A new game has been created');
    } else {
        console.log('A new game was not created');
    }

    return newGame?.getGameId();

    
}