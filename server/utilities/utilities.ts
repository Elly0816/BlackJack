import { clearInterval } from "timers";
import Card from "../classes/cardClass";
import fs from "fs/promises";

export function getNumberFromCard(card:ReturnType<Card['getCardDetails']>['face']):number {
    const cardNumber = card.toUpperCase();
    if (cardNumber.startsWith('A')) return 1;
    if ((cardNumber.startsWith('J')) || (cardNumber.startsWith('Q')) || (cardNumber.startsWith('K'))) return 10;
    return parseInt(cardNumber);
};


export async function parseDeck():Promise<Card[]>{
    const cards:Card[] = [];    
    try {
        console.log(`Parsing Deck`);;
        let cardsFromFile:string|string[] = (await fs.readFile('./text.txt', {encoding: 'utf8'}))
        .replace("]", "")
        .replace("[", "")
        .split(",")
        .map((card) => card.replace(".png'", "").split("'")[1]);  

        for(let i=0; i<cardsFromFile.length; i++) {
            cards.push(new Card(cardsFromFile[i]));
        }
    } catch(e) {
        console.log(`There was an error parsing the deck`);
        console.log(e);

    };
    // console.log(`Returning Cards\n`);
    // console.log(JSON.stringify(cards));
    return cards;
}


export function cleanupTimers(timeout:NodeJS.Timeout[]):void{
    for(const t of timeout){
        clearTimeout(t);
    }
}