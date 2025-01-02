import { CardType, DeckType } from '../../types/gameType/gameFromServerType';
import getNameFromCard from '../../utilities/Utilities';
import React, { ReactElement } from 'react';
import './Card.css';

type CardProps = CardType | DeckType;

export default function Card(props: CardProps): ReactElement {
  const isDeckType = (props: CardProps): props is DeckType => {
    return 'type' in props && props.type === 'deck';
  };

  if (!isDeckType(props)) {
    const imgURL = getNameFromCard(props);

    return (
      <div className="card max-h-fit max-w-fit">
        <img src={imgURL} alt={imgURL} />
      </div>
    );
  }

  // const {type, ...others} = props;

  const { numberOfCards } = props;

  return (
    <div className="card back max-h-fit max-w-fit flex-shrink flex-grow">
      <img src="./back.png" alt="./back.png" />
      <div className="card-amount">
        {/* <h1> */}
        {numberOfCards}
        {/* </h1> */}
      </div>
      {/* </img> */}
    </div>
  );
}
