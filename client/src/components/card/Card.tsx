import { CardType, DeckType } from '../../types/gameType/gameFromServerType';
import getNameFromCard from '../../utilities/Utilities';
import React, { ReactElement, useContext } from 'react';
import { GameStateContext } from '../../contexts/gameStateContext';
import './Card.css';
import GoBack from '../goBack/GoBack';
import { gameContext, gameContextAndTurn } from '../../contexts/gameContext';
import Emitter from '../../socket/emitters/Emitters';

type CardProps = CardType | DeckType | Omit<DeckType, 'numberOfCards'>;

export default function Card(props: CardProps): ReactElement {
  const isDeckType = (props: CardProps): props is DeckType => {
    return 'type' in props && props.type === 'deck';
  };

  const gameScoreContext = useContext(GameStateContext);
  const { setGame, id } = useContext(gameContext) as gameContextAndTurn;

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

  if (gameScoreContext && isDeckType(props))
    return (
      <div className="main-container flex flex-row justify-between items-center min-w-full px-8">
        {/* <div>
        </div> */}
        <GoBack
          onClick={() => {
            setGame(undefined);
            Emitter.getInstance().resetGame(id);
            // console.log('Go back was clicked');
            // console.log(dealer);
            // console.log(id);
            // console.log(isTurn);
            // console.log(deck);
            // console.log(players);
          }}
        />
        <h1>{gameScoreContext.toUpperCase()}</h1>
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
    );

  return (
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
  );
}
