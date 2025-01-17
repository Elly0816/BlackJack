import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { GameDealerType } from '../../types/gameType/gameFromServerType';
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

  const listener = useMemo(() => {
    return Listener.getInstance();
  }, []);

  useEffect(() => {
    listener.faceUp(() => {
      setSecondCardBack(false);
      console.log(`The client socket heard a face up event`);
    });

    return () => {
      Listener.removeListener();
    };
  }, [listener]);

  return (
    <div className="max-h-fit max-w-fit">
      <h2>{name.split(':')[0]}</h2>
      <div className="cards">
        <Deck cards={cards} secondCardBack={secondCardBack} />
      </div>
    </div>
  );
}
