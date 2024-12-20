import { Player } from "./playerClass";

export default class gameManager {

    private static searchingPlayers:Player[] = [];

    // constructor(){
    //     for(const p of Player.players){
    //         if(p.getStatus() == 'searching'){
    //             gameManager.searchingPlayers.push(p);
    //         }
    //     }
    // }

    static getSearchingPlayers():Player[]{
        for(const p of Player.players){
            if(p.getStatus() == 'searching'){
                gameManager.searchingPlayers.push(p);
            }
        }
        return gameManager.searchingPlayers;
    }
}