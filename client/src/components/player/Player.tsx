import React, { ReactElement } from "react";
import { GamePlayerType } from "../../types/gameType/gameFromServerType";
import './Player.css';

export default function Player({player}:{player:GamePlayerType}):ReactElement{


    return <div className="player"></div>
}