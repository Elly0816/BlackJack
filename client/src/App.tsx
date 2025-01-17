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

  const handleGameEvent = useMemo(
    () => ({
      blackJack: () => {
        setGameState('blackjack');
        console.log('BlackJack');
      },
      draw: () => {
        setGameState('draw');
        console.log('draw');
      },
      houseWins: () => {
        setGameState('houseWins');
        console.log('house wins');
      },
      winner: () => {
        setGameState('winner');
        console.log('winner');
      },
      bust: () => {
        setGameState('bust');
        console.log('bust');
      },
      lose: () => {
        setGameState('lose');
        console.log('You Lose');
      },
      game: (gameFromServer: string) => {
        setGame(JSON.parse(gameFromServer));
        setSearching(false);
      },
      searchError: () => {
        console.log('Search error');
        setSearching(false);
      },
      shuffle: (gameFromServer: string) => {
        setGame(JSON.parse(gameFromServer));
      },
      show: () => {
        setIsTurn(true);
      },
      hide: () => {
        setIsTurn(false);
      },
      dealer: (game: string) => {
        setGame(JSON.parse(game));
      },
      score: (game: string) => {
        const parsedGame: GameFromServerType = JSON.parse(game);
        setIsTurn(false);
        setGame(parsedGame);
      },
    }),
    []
  );

  useEffect(() => {
    // const gameListener = Listener.getInstance();

    // Setup all listeners
    gameListener.blackJack(handleGameEvent.blackJack);
    gameListener.draw(handleGameEvent.draw);
    gameListener.houseWins(handleGameEvent.houseWins);
    gameListener.winner(handleGameEvent.winner);
    gameListener.bust(handleGameEvent.bust);
    gameListener.lose(handleGameEvent.lose);
    gameListener.game(handleGameEvent.game);
    gameListener.searchError(handleGameEvent.searchError);
    gameListener.shuffle(handleGameEvent.shuffle);
    gameListener.show(handleGameEvent.show);
    gameListener.hide(handleGameEvent.hide);
    gameListener.dealer(handleGameEvent.dealer);
    gameListener.score(handleGameEvent.score);

    // Cleanup
    return () => {
      Listener.removeListener();
      Emitter.removeEmitter();
    };
  }, [handleGameEvent, gameListener]);

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
