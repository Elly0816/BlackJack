interface GamePlayerType {
    id: string;
    name: string; 
    cards: string[];
    total: number;
}

interface GameDealerType {
    cards: string[];
    total: number;
    name: string;
}

export type GameFromServerType = {
    id: string;
    deck: string[];
    players: GamePlayerType[];
    dealer: GameDealerType;
}