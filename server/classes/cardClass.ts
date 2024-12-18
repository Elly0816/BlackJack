type cardSuite = 'S'|'C'|'D'|'H';

export default class Card {

    private cardFace:number|string;
    private cardSuite:cardSuite;


    constructor(cardDetails:string) {
        this.cardFace = cardDetails.split('.')[0].split('_')[0];
        this.cardSuite = cardDetails.split('.')[0].split('_')[1] as cardSuite;
    };

    getCardDetails():{suite:cardSuite, face:number|string} {
        return {
            suite: this.cardSuite,
            face: this.cardFace
        }
    };
}