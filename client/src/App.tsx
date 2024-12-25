import useFetch from "./hooks/useFetch";
import React, { ReactElement, useState } from 'react';
import Home from "./pages/Home";
import { searchingContext } from "./contexts/searchingContext";
import Listener from "./socket/listeners/Listeners";
import { GameFromServerType } from "./types/gameType/gameFromServerType";
import { gameContext } from "./contexts/gameContext";
import Table from "./components/Table";

export default function App():ReactElement{
    const [searching, setSearching] = useState<boolean>(false);
    const [game, setGame] = useState<GameFromServerType>();
    const {data} = useFetch();
    let divToReturn:ReactElement;

    const gameListener = Listener.getInstance();
    gameListener.game((gameFromServer) => {
        setGame(JSON.parse(gameFromServer));
        setSearching(false);
    });

    
    

    if(!data){
        divToReturn =  <div>The data is not available</div>
    }

    divToReturn = <Home/>

    if(game){
        const {id, deck, players, dealer} = game;
        divToReturn = <Table id={id} deck={[...deck]} players={[...players]} dealer={dealer}/>
    }

    


    return <div>
        <gameContext.Provider value={game? 
        game as GameFromServerType:game as unknown as null}>
        <searchingContext.Provider value={{searching, setSearching}}>
            {divToReturn}
            {data? `This is the data: ${data}`:`The data is not available`}
        </searchingContext.Provider>
        </gameContext.Provider>
        </div>



}