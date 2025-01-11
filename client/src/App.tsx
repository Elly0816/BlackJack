import './output.css';
import './App.css';
import useFetch from './hooks/useFetch';
import React, { ReactElement, useState, useMemo } from 'react';
import Home from './pages/home/Home';
import { searchingContext } from './contexts/searchingContext';
import Listener from './socket/listeners/Listeners';
import { GameFromServerType } from './types/gameType/gameFromServerType';
import { gameContext } from './contexts/gameContext';
import Table from './pages/table/Table';

type scoreType = 'BlackJack' | 'lose' | null;

export default function App(): ReactElement {
  const [searching, setSearching] = useState<boolean>(false);
  const [game, setGame] = useState<GameFromServerType>();
  const [isTurn, setIsTurn] = useState<boolean>();
  const [score, setScore] = useState<scoreType>(null);

  const { data, error } = useFetch();
  let divToReturn: ReactElement;

  // const gameListener = Listener.getInstance();

  const gameListener = useMemo(() => {
    return Listener.getInstance();
  }, []);

  /*
   * blackjack
   * draw
   * houseWins
   * winner
   * bust
  
  
  */
  gameListener.blackJack(() => {
    console.log('BlackJack');
  });

  gameListener.draw(() => {
    console.log('draw');
  });

  gameListener.houseWins(() => {
    console.log('house wins');
  });

  gameListener.winner(() => {
    console.log('winner');
  });

  gameListener.bust(() => {
    console.log('bust');
  });

  gameListener.lose(() => {
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
    setScore('BlackJack');
    setGame(parsedGame);
    // gameEmitter.show(parsedGame.id);
  });

  divToReturn = <Home />;

  if (score === 'BlackJack') {
    divToReturn = <div>The game should be scored now</div>;
  }

  if (!data) {
    divToReturn = <div>The data is not available</div>;
  }

  if (error) {
    divToReturn = <div>There was an network error: {`\n` + error}</div>;
  }

  if (game) {
    const { id, deck, players, dealer } = game;
    divToReturn = (
      <Table id={id} deck={[...deck]} players={[...players]} dealer={dealer} />
    );
  }

  return (
    <div className="h-full">
      <gameContext.Provider
        value={
          game
            ? { ...(game as GameFromServerType), isTurn: isTurn as boolean }
            : (game as unknown as null)
        }
      >
        <searchingContext.Provider value={{ searching, setSearching }}>
          {divToReturn}
          {/* {data? `This is the data: ${data}`:`The data is not available`} */}
        </searchingContext.Provider>
      </gameContext.Provider>
    </div>
  );
}
