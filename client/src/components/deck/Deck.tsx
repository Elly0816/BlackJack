import React, { ReactElement } from "react";
import { CardType } from "../../types/gameType/gameFromServerType";
import Card from "../card/Card";


export default function Deck({cards}:{cards:CardType[]}):ReactElement{

    return <div className="deck">
        {cards.map(c => <Card cardFace={c.cardFace} cardNumber={c.cardNumber} cardSuite={c.cardSuite}/>)}
    </div>
}