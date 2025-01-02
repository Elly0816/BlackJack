import './output.css';
import './App.css';
import useFetch from './hooks/useFetch';
import React, { ReactElement, useState } from 'react';
import Home from './pages/home/Home';
import { searchingContext } from './contexts/searchingContext';
import Listener from './socket/listeners/Listeners';
import { GameFromServerType } from './types/gameType/gameFromServerType';
import { gameContext } from './contexts/gameContext';
import Table from './pages/table/Table';

export default function App(): ReactElement {
  const [searching, setSearching] = useState<boolean>(false);
  const [game, setGame] = useState<GameFromServerType>();
  const [isTurn, setIsTurn] = useState<boolean>();

  const { data } = useFetch();
  let divToReturn: ReactElement;

  const gameListener = Listener.getInstance();
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

  if (!data) {
    divToReturn = <div>The data is not available</div>;
  }

  divToReturn = <Home />;

  if (game) {
    const { id, deck, players, dealer } = game;
    divToReturn = (
      <Table id={id} deck={[...deck]} players={[...players]} dealer={dealer} />
    );
  }

  return (
    <div className="h-full">
      <gameContext.Provider
        value={game ? (game as GameFromServerType) : (game as unknown as null)}
      >
        <searchingContext.Provider value={{ searching, setSearching }}>
          {divToReturn}
          {/* {data? `This is the data: ${data}`:`The data is not available`} */}
        </searchingContext.Provider>
      </gameContext.Provider>
    </div>
  );
}
