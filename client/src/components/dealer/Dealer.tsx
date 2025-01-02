import React, { ReactElement } from 'react';
import { GameDealerType } from '../../types/gameType/gameFromServerType';
// import Card from "../card/Card";
import './Dealer.css';
import Deck from '../deck/Deck';

export default function Dealer({
  dealer,
}: {
  dealer: GameDealerType;
}): ReactElement {
  const { cards, name } = dealer;

  return (
    <div className="max-h-fit max-w-fit">
      {/* // <div className="flex flex-col justify-center align-middle w-screen h-full"> */}
      <h2>{name.split(':')[0]}</h2>
      <div className="cards">
        <Deck cards={cards} />
        {/* {cards.map((c, i) => (
            <Card
              cardFace={c.cardFace}
              cardSuite={c.cardSuite}
              cardNumber={c.cardNumber}
              key={i}
            />
          ))} */}
      </div>
    </div>
  );
}
