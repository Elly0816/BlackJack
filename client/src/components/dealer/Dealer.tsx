import React, { ReactElement } from "react";
import { GameDealerType } from "../../types/gameType/gameFromServerType";
import Card from "../card/Card";
import "./Dealer.css";

export default function Dealer({
  dealer,
}: {
  dealer: GameDealerType;
}): ReactElement {
  const { cards, name } = dealer;

  return (
    <div className="dealer">
      <h2>{name.split(":")[0]}</h2>
      {cards && (
        <div className="cards">
          {cards.map((c) => (
            <Card
              cardFace={c.cardFace}
              cardSuite={c.cardSuite}
              cardNumber={c.cardNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}
