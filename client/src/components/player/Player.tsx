import React, { ReactElement, useContext } from 'react';
import { GameStateContext } from '../../contexts/gameStateContext';
import { GamePlayerType } from '../../types/gameType/gameFromServerType';
import { connectedSocket } from '../../socket/Socket';
import './Player.css';
import Deck from '../deck/Deck';

export default function Player({
  player,
}: {
  player: GamePlayerType;
}): ReactElement {
  const { id: playerID, cards, name } = player;

  const { id } = connectedSocket;

  const gameState = useContext(GameStateContext);

  return (
    // <div className="player">
    <div
      className={`max-w-fit mx-2 max-h-fit ${
        playerID === id ? 'order-first w-3/5' : ''
      }`}
    >
      {/*
            3 divs in a flex col
            first div should contain the name 
            second div should contain the cards and the total, cards should be a div of it's own with flex row
            the second div should also have a flex row 
            third div should contain the buttons {hit or stand }
          */}
      <h2>{playerID === id ? 'Me' : name}</h2>
      {/* <div className="cards-total-container"> */}
      {playerID === id && gameState && gameState === 'blackjack' && (
        <h1>BlackJack!</h1>
      )}
      {playerID === id && gameState && gameState === 'bust' && <h1>Bust!</h1>}
      {playerID === id && gameState && gameState === 'draw' && <h1>Draw!</h1>}
      {playerID === id && gameState && gameState === 'houseWins' && (
        <h1>House Wins!</h1>
      )}
      {playerID === id && gameState && gameState === 'lose' && <h1>Lose!</h1>}
      {playerID === id && gameState && gameState === 'winner' && (
        <h1>Winner!</h1>
      )}
      <div className="cards">
        <Deck cards={cards} />
      </div>
      {/* <h3>{total}</h3> */}
      {/* </div> */}
    </div>
  );
}
