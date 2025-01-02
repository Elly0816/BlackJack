import React, { ReactElement } from 'react';
import { CardType } from '../../types/gameType/gameFromServerType';
import Card from '../card/Card';

export default function Deck({ cards }: { cards: CardType[] }): ReactElement {
  return (
    <div className="deck flex flex-row">
      {/* return{' '} */}
      {cards.map((c, i) => (
        <Card
          key={i}
          cardFace={c.cardFace}
          cardNumber={c.cardNumber}
          cardSuite={c.cardSuite}
        />
      ))}
    </div>
  );
}
