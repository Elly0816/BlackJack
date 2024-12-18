import Card from "../classes/cardClass";

export function getNumberFromCard(card:ReturnType<Card['getCardDetails']>['face']):number {
    const cardNumber = card.toUpperCase();
    if (cardNumber === 'A') return 1;
    if (cardNumber === 'J' || cardNumber === 'Q' || cardNumber === 'K') return 10;
    return parseInt(cardNumber);
}