import { Socket } from "socket.io";
import Card from "./cardClass";

export type playerStatusType = 'inGame'|'searching'|'notInGame';

export class Player {

    private playerName:string;
    private playerCards: Card[];
    private playerTotal: number;
    protected readonly playerSocket:Socket|null;
    static players: Player[] = [];
    protected status:playerStatusType;


    constructor (playerName:string, socket:Socket|null){
        this.playerName = playerName;
        this.playerCards = [];
        this.playerTotal = 0;
        this.playerSocket = socket;
        this.status = "notInGame";
        if (this.constructor === Player){
            Player.players.push(this);
        }
}

    getStatus():playerStatusType{
        return this.status;
    }

    
    setStatus(status:playerStatusType):void{
        this.status = status;
    }

    addCard(card:Card):Card[]{
        this.playerCards.push(card);
        this.updateTotal();
        return this.getCards();
    };

    private updateTotal():void {
        let total:number = 0;   
        for(let i:number=0; i<this.playerCards.length; i++){
            total += this.playerCards[i].getCardDetails().number;
        };
        
        if((total+10)<= 21 && this.playerCards.map(card => card.getCardDetails()['face'].toLowerCase()).includes('ace')){
            total += 10;

        };

        this.playerTotal = total;

    };

    getSocket():Socket|null{
        return this.playerSocket;
    }

    getTotal():number{
        return this.playerTotal;
    }

    getCards():Card[]{
        return this.playerCards;
    };

    getName():string {
        return this.playerName;
    };

    setName(name:string):void {
        this.playerName = name;
    }




}

export class Dealer extends Player {

    

    constructor (playerName:string){
        super(playerName, null);
        this.status = "inGame";
    }

    shuffleCards(cards:Card[]):void{
        if(!cards||cards.length <=1 ) return;
        for(let i= cards.length-1; i>0; i--){
            let j = Math.floor(Math.random() * cards.length);
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    dealCards(cards:Card[], player:Player):void{
        player.addCard(cards.pop() as unknown as Card);
    }
}