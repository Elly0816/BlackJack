import { ReactElement } from "react";
import { GameFromServerType } from "../types/gameType/gameFromServerType";
import React from "react";
import Deck from "../components/Deck";

export default function Table(props:GameFromServerType):ReactElement{
    const {deck, players, id, dealer} = props;

    console.log({...props});

    /*

    This should use the props in order to render the game table
    The deck should be shown on the right, the players should be shown at the bottom and the dealer should be shown at the top
     */
    // return <>{`The players:\n ${players.map(p => p.name+'\n')}
    //     are playing a game with ${deck.length} cards.
    // `}</>
    return <div className="table">
    {//Dealer, deck and players should be on here
    }
    <Deck cards={deck}/>

    </div>
}