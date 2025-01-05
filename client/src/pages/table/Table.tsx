import { ReactElement, useState, useContext } from 'react';
import { GameFromServerType } from '../../types/gameType/gameFromServerType';
import React from 'react';
import Dealer from '../../components/dealer/Dealer';
import './Table.css';
import Player from '../../components/player/Player';
import Card from '../../components/card/Card';
import Emitter from '../../socket/emitters/Emitters';
import { gameContext, gameContextAndTurn } from '../../contexts/gameContext';
import HitAndStandButtons from '../../components/hitAndStandButtons/HitAndStandButtons';

export default function Table(props: GameFromServerType): ReactElement {
  const { id, deck, dealer, players } = props;
  const [ready, setReady] = useState<boolean>(false);

  console.log({ ...props });

  const { isTurn } = useContext(gameContext) as gameContextAndTurn;

  /*

    This should use the props in order to render the game table
    The deck should be shown on the right, the players should be shown at the bottom and the dealer should be shown at the top
     */
  // return <>{`The players:\n ${players.map(p => p.name+'\n')}
  //     are playing a game with ${deck.length} cards.
  // `}</>
  return (
    <div className="my-table h-screen flex flex-col justify-evenly items-center">
      {/* // <div className="min-h-screen"> */}
      {
        //Dealer, deck and players should be on here
      }
      <Dealer dealer={dealer} />
      <Card numberOfCards={deck.length} type="deck" />
      <div className="flex player-button">
        <div className="flex flex-row h-fit max-h-fit flex-shrink justify-evenly items-center w-min">
          {players.map((p, i) => (
            <Player player={p} key={i} />
          ))}
        </div>
        {!ready && (
          <button
            className="ready-button"
            type="button"
            onClick={() => {
              Emitter.getInstance().ready(id);
              setReady(true);
            }}
          >
            Ready
          </button>
        )}
      </div>
      {isTurn && <HitAndStandButtons />}
    </div>
  );
}
