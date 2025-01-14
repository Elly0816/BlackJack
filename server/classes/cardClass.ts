import { getNumberFromCard } from '../utilities/utilities';

type cardSuite = 'S' | 'C' | 'D' | 'H';

export default class Card {
  private cardFace: string;
  private cardSuite: cardSuite;
  private cardNumber: number;

  constructor(cardDetails: string) {
    this.cardFace = cardDetails.split('.')[0].split('_')[0].toUpperCase();
    this.cardSuite = cardDetails.split('.')[0].split('_')[1].toUpperCase() as cardSuite;
    this.cardNumber = getNumberFromCard(this.cardFace);
  }

  setAceToEleven(): void {
    if (this.cardFace.toLowerCase() === 'ace' && this.cardNumber === 1) {
      this.cardNumber = 11;
    }
  }

  getCardDetails(): { suite: cardSuite; face: string; number: number } {
    return {
      suite: this.cardSuite,
      face: this.cardFace,
      number: this.cardNumber,
    };
  }
}
