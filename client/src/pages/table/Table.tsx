import { ReactElement, useState, useContext, useEffect } from 'react';
import React from 'react';
import Dealer from '../../components/dealer/Dealer';
import './Table.css';
import Player from '../../components/player/Player';
import Card from '../../components/card/Card';
import Emitter from '../../socket/emitters/Emitters';
import { gameContext, gameContextAndTurn } from '../../contexts/gameContext';
import HitAndStandButtons from '../../components/hitAndStandButtons/HitAndStandButtons';

export default function Table(): ReactElement {
  // const { id, deck, dealer, players } = useContext(gameContext);
  const [ready, setReady] = useState<boolean>(false);

  const { isTurn, id, deck, dealer, players } = useContext(
    gameContext
  ) as gameContextAndTurn;

  useEffect(() => {
    const singleAudio = new Audio('./cardPlace1.wav');
    const dealingAudio = new Audio('./dealing card.wav');
    if (dealer.cards.length < 2) {
      playAudio('dealing');
    } else {
      playAudio('single');
    }

    async function playAudio(type: 'single' | 'dealing'): Promise<void> {
      try {
        if (type === 'dealing') {
          await dealingAudio.play();
        } else {
          await singleAudio.play();
        }
      } catch (e) {
        console.log('There was an error playing the audio:\n' + e);
      }
    }

    return () => {
      singleAudio.pause();
      dealingAudio.pause();
      singleAudio.currentTime = 0;
      dealingAudio.currentTime = 0;
      singleAudio.src = '';
      dealingAudio.src = '';
    };
  }, [dealer.cards.length, deck]);

  /*

    This should use the props in order to render the game table
    The deck should be shown on the right, the players should be shown at the bottom and the dealer should be shown at the top
     */
  // return <>{`The players:\n ${players.map(p => p.name+'\n')}
  //     are playing a game with ${deck.length} cards.
  // `}</>
  return (
    <div className="my-table h-min flex flex-col justify-evenly items-center">
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
