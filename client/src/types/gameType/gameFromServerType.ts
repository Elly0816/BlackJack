export type GamePlayerType = {
    id: string;
    name: string; 
    cards: CardType[];
    total: number;
}

export type GameDealerType = {
    cards: CardType[];
    total: number;
    name: string;
}

type cardSuite = 'S'|'C'|'D'|'H';

export type CardType = {
    suite: cardSuite,
    face: string,
    number:number
}

export type GameFromServerType = {
    id: string;
    deck: CardType[];
    players: GamePlayerType[];
    dealer: GameDealerType;
}