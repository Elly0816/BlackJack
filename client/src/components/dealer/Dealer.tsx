import React, { ReactElement, useState } from 'react';
import { GameDealerType } from '../../types/gameType/gameFromServerType';
// import Card from "../card/Card";
import './Dealer.css';
import Deck from '../deck/Deck';
import Listener from '../../socket/listeners/Listeners';

export default function Dealer({
  dealer,
}: {
  dealer: GameDealerType;
}): ReactElement {
  const { cards, name } = dealer;

  const [secondCardBack, setSecondCardBack] = useState<boolean>(true);

  const listener = Listener.getInstance();
  listener.faceUp(() => {
    setSecondCardBack(false);
    console.log(`The client socket heard a face up event`);
  });

  return (
    <div className="max-h-fit max-w-fit">
      {/* // <div className="flex flex-col justify-center align-middle w-screen h-full"> */}
      <h2>{name.split(':')[0]}</h2>
      <div className="cards">
        <Deck cards={cards} secondCardBack={secondCardBack} />
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
