import {Dealer, Player} from "./playerClass";
import Card from "./cardClass";

export default class BlackJack {

    private players: Player[];
    private deck: Card[];
    static numberOfGames:number = 0;
    private id:number;
    private dealer:Dealer;

    constructor(players:Player[], deck:Card[], dealer:Dealer){
        this.players = players;
        this.dealer = dealer;
        this.deck = deck;
        this.id = ++BlackJack.numberOfGames
    }


    shuffleCards():void{
        this.dealer.shuffleCards(this.deck);
    }

    dealCards(n:number=1):void {

        try {
            if (this.deck.length < 1) {
                // this.checkForBlackJack();
                console.log('Not enough cards in the deck');
                throw new Error('Not enough cards in the deck');
            };
    
    
            for(let i=0; i<n; i++){
                this.dealer.addCard(this.deck.pop() as unknown as Card);
                for (let i= 0; i<this.players.length; i++){
                    this.players[i].addCard(this.deck.pop() as unknown as Card);
                }
            }
        }catch (e){
            // this.checkForBlackJack();
            console.log(e);
        }
    }
    


    static checkIsRemoved(game:BlackJack|null):boolean{
        if (!game){
            BlackJack.numberOfGames--;
            return true;
        } else {
            return false;
        }
        
    }


}