import { CardType, DeckType } from '../../types/gameType/gameFromServerType';
import getNameFromCard from '../../utilities/Utilities';
import React, { ReactElement, useContext } from 'react';
import { GameStateContext } from '../../contexts/gameStateContext';
import './Card.css';

type CardProps = CardType | DeckType | Omit<DeckType, 'numberOfCards'>;

export default function Card(props: CardProps): ReactElement {
  const isDeckType = (props: CardProps): props is DeckType => {
    return 'type' in props && props.type === 'deck';
  };

  const gameContext = useContext(GameStateContext);

  if (!isDeckType(props)) {
    const imgURL = getNameFromCard(props as CardType);

    return (
      <div className="card max-h-fit max-w-fit">
        <img src={imgURL} alt={imgURL} />
      </div>
    );
  }

  // const {type, ...others} = props;

  const { numberOfCards } = props;

  return (
    <>
      {gameContext && isDeckType(props) ? (
        <div className="main-container flex flex-row justify-between items-center min-w-full px-8">
          {/* <div>
        </div> */}
          <h1>Something</h1>
          <div className="card back max-h-fit max-w-fit">
            {/* <h1>Something</h1> */}
            <img src="./back.png" alt="./back.png" />
            {numberOfCards && (
              <div className="card-amount">
                {/* <h1> */}
                {numberOfCards}
                {/* </h1> */}
              </div>
            )}
            {/* </img> */}
          </div>
        </div>
      ) : (
        <div className="card back max-h-fit max-w-fit">
          {/* <h1>Something</h1> */}
          <img src="./back.png" alt="./back.png" />
          {numberOfCards && (
            <div className="card-amount">
              {/* <h1> */}
              {numberOfCards}
              {/* </h1> */}
            </div>
          )}
          {/* </img> */}
        </div>
      )}
    </>
  );
}
