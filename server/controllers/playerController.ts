import { Socket } from "socket.io";
import { Player } from "../classes/playerClass";

export function createPlayer(playerName:string, socket:Socket):Player{
    const player = new Player(playerName, socket);
    // Player.players.push(player);

    return player;
}