import './output.css';
import './App.css';
import useFetch from './hooks/useFetch';
import React, { ReactElement, useState, useMemo, useEffect } from 'react';
import Home from './pages/home/Home';
import { searchingContext } from './contexts/searchingContext';
import { GameStateContext } from './contexts/gameStateContext';
import Listener, { GameScoreType } from './socket/listeners/Listeners';
import { GameFromServerType } from './types/gameType/gameFromServerType';
import { gameContext } from './contexts/gameContext';
import Table from './pages/table/Table';
import Emitter from './socket/emitters/Emitters';

// type scoreType = 'BlackJack' | 'lose' | null;

export default function App(): ReactElement {
  const [searching, setSearching] = useState<boolean>(false);
  const [game, setGame] = useState<GameFromServerType>();
  const [isTurn, setIsTurn] = useState<boolean>();
  // const [score, setScore] = useState<scoreType>(null);
  const [gameState, setGameState] = useState<GameScoreType>();

  // const abortController = new AbortController();
  const { data, error } = useFetch();
  let divToReturn: ReactElement;

  // const gameListener = Listener.getInstance();

  const gameListener = useMemo(() => {
    return Listener.getInstance();
  }, []);

  useEffect(() => {
    if (!game) {
      setGameState(undefined);
      setIsTurn(undefined);
    }
  }, [game]);

  /*
   * blackjack
   * draw
   * houseWins
   * winner
   * bust
  
  
  */

  useEffect(() => {
    return () => {
      Listener.removeListener();
      Emitter.removeEmitter();
    };
  }, [gameListener]);

  gameListener.blackJack(() => {
    setGameState('blackjack');
    console.log('BlackJack');
  });

  gameListener.draw(() => {
    setGameState('draw');
    console.log('draw');
  });

  gameListener.houseWins(() => {
    setGameState('houseWins');
    console.log('house wins');
  });

  gameListener.winner(() => {
    setGameState('winner');
    console.log('winner');
  });

  gameListener.bust(() => {
    setGameState('bust');
    console.log('bust');
  });

  gameListener.lose(() => {
    setGameState('lose');
    console.log('You Lose');
  });

  gameListener.game((gameFromServer) => {
    setGame(JSON.parse(gameFromServer));
    setSearching(false);
  });

  gameListener.searchError(() => {
    console.log('There was an error with searching for a game to join');
    setSearching(false);
  });

  gameListener.shuffle((gameFromServer) => {
    setGame(JSON.parse(gameFromServer));
  });

  gameListener.show(() => {
    console.log(`Socket heard a show event`);
    setIsTurn(true);
  });

  gameListener.hide(() => {
    console.log(`Socket heard a hide event`);
    setIsTurn(false);
  });

  gameListener.dealer((game) => {
    setGame(JSON.parse(game));
  });

  gameListener.score((game) => {
    const parsedGame: GameFromServerType = JSON.parse(game);
    console.log(`Socket heard a score event`);
    console.log('This is the game:\n');
    console.log(game);
    setIsTurn(false);
    // setScore('BlackJack');
    setGame(parsedGame);
    // gameEmitter.show(parsedGame.id);
  });

  divToReturn = <Home />;

  // if (score === 'BlackJack') {
  //   divToReturn = <div>The game should be scored now</div>;
  // }

  if (!data) {
    divToReturn = <div>The data is not available</div>;
  }

  if (error) {
    divToReturn = <div>There was an network error: {`\n` + error}</div>;
  }

  if (game) {
    divToReturn = <Table />;
  }

  return (
    <div className="h-full">
      <gameContext.Provider
        value={
          game
            ? {
                ...(game as GameFromServerType),
                isTurn: isTurn as boolean,
                setGame: setGame,
              }
            : (game as unknown as null)
        }
      >
        <searchingContext.Provider value={{ searching, setSearching }}>
          <GameStateContext.Provider value={gameState}>
            {divToReturn}
            {/* {data? `This is the data: ${data}`:`The data is not available`} */}
          </GameStateContext.Provider>
        </searchingContext.Provider>
      </gameContext.Provider>
    </div>
  );
}
