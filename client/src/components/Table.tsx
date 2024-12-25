import { ReactElement } from "react";
import { GameFromServerType } from "../types/gameType/gameFromServerType";
import React from "react";

export default function Table(props:GameFromServerType):ReactElement{
    const {deck, players} = props;
    return <>{`The players:\n ${players.map(p => p.name+'\n')}
        are playing a game with ${deck.length} cards.
    `}</>
}