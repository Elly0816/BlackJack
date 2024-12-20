import { Player } from "../classes/playerClass";
import BlackJack from "../classes/gameClass";
import { parseDeck } from "../utilities/utilities";
import gameManager from "../classes/gameManager";





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

    const desiredNumberOfPlayers = 3;
    let playersToAddToGame: Player[] = [player];

    for(const p of gameManager.getSearchingPlayers()
        .filter(p => p.getSocket()?.id != player.getSocket()?.id)){
            playersToAddToGame.push(p);
        if(new Set(playersToAddToGame).size == desiredNumberOfPlayers){
            break;
        }
    }
   

    if(new Set(playersToAddToGame).size != desiredNumberOfPlayers){
        player.setStatus('notInGame');
        return newGame;
    }
    
    
    console.log(`Creating new BlackJack game`);
    newGame = new BlackJack(Array.from(new Set(playersToAddToGame)), await parseDeck(), player.getSocket()?.id as string);

    
    if (newGame){
        player.setStatus('inGame');
        playersToAddToGame.forEach(p => {
            p.setStatus('inGame');
            p.getSocket()?.join(String(newGame?.getGameId()));
        }); 
        console.log('A new game has been created');
    } else {
        console.log('A new game was not created');
    }

    return newGame?.getGameId();

    
}