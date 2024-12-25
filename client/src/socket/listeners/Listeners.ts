import { Socket } from "socket.io-client";
import { connectedSocket } from "../Socket";
import { GameFromServerType } from "../../types/gameType/gameFromServerType";

export default class Listener {

    private socket:Socket = connectedSocket;
    static instance:Listener 

    private constructor(){}

    static getInstance():Listener{
        if(Listener.instance){
            return Listener.instance;
        }
        Listener.instance = new Listener();
        return Listener.instance;
    }

    searchError(){}

    game(cb:(game:string) => void):void{
        this.socket.on('game', cb);
    }

    shuffle(cb:() => void):void{
        this.socket.on('shuffle', cb)
    }

}