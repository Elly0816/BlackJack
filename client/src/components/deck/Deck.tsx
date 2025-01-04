import React, { ReactElement } from 'react';
import { CardType } from '../../types/gameType/gameFromServerType';
import Card from '../card/Card';

export default function Deck({
  cards,
  secondCardBack,
}: {
  cards: CardType[];
  secondCardBack?: boolean;
}): ReactElement {
  if (secondCardBack) {
    return (
      <div className="deck flex flex-row">
        {cards.map((c, i) => {
          if (i === 1) {
            return <Card key={i} type="deck" />;
          }
          return (
            <Card
              key={i}
              cardFace={c.cardFace}
              cardNumber={c.cardNumber}
              cardSuite={c.cardSuite}
            />
          );
        })}
      </div>
    );
  }
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
