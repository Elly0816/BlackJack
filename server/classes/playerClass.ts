import Card from "./cardClass";

export class Player {

    private playerName:string;
    private playerCards: Card[];
    private playerTotal: number;


    constructor (playerName:string){
        this.playerName = playerName;
        this.playerCards = [];
        this.playerTotal = 0;
    };

    addCard(card:Card):Card[]{
        this.playerCards.push(card);
        this.updatePlayerTotal();
        return this.getCards();
    };

    updatePlayerTotal():void {
        let total:number = 0;   
        for(let i:number=0; i<this.playerCards.length; i++){
            total += this.playerCards[i].getCardDetails().number;
        };
        
        if((total+10)<= 21 && this.playerCards.map(card => card.getCardDetails()['face'].toLowerCase()).includes('ace')){
            total += 10;

        };

        this.playerTotal = total;

    };

    getCardsTotal():number{
        return this.playerTotal;
    }

    getCards():Card[]{
        return this.playerCards;
    };

    getPlayerName():string {
        return this.playerName;
    };




}

export class Dealer extends Player {

    constructor (playerName:string){
        super(playerName);
    }

    shuffleCards(cards:Card[]):void{
        for(let i= cards.length-1; i>0; i--){
            let j = Math.floor(Math.random() * cards.length);
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    dealCards(cards:Card[], player:Player):void{
        player.addCard(cards.pop() as unknown as Card);
    }
}