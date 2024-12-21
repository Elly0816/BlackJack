import { Socket } from "socket.io";
import { Player } from "../classes/playerClass";

export function createPlayer(playerName:string, socket:Socket):Player{
    const player = new Player(playerName, socket);
    // Player.players.push(player);

    return player;
}


export function removePlayerOnDisconnect(player:Player):void{
    const indexOfPlayer = Player.players.indexOf(player);
    if(indexOfPlayer > -1){
        // console.log(`Removing ${Player.players[indexOfPlayer].getName()}`);
        Player.players.splice(indexOfPlayer, 1);
    }
}