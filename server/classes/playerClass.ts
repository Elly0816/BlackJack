import Card from "./cardClass";

export class Player {

    private playerName:string;
    private playerCards: Card[];


    constructor (playerName:string){
        this.playerName = playerName;
        this.playerCards = [];
    }

    addCard(card:Card):Card[]{
        this.playerCards.push(card);
        return this.getCards();
    }

    getCards():Card[]{
        return this.playerCards;
    }

    getPlayerName() {
        return this.playerName;
    }


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

    dealCards(cards:Card[], player:Player){
        player.addCard(cards.pop() as unknown as Card);
    }
}