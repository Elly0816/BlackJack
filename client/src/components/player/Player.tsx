import React, { ReactElement } from "react";
import { GamePlayerType } from "../../types/gameType/gameFromServerType";
import { connectedSocket } from "../../socket/Socket";
import './Player.css';
import Deck from "../deck/Deck";

export default function Player({player}:{player:GamePlayerType}):ReactElement{

    const {id:playerID, cards, name, total} = player;

    const {id} = connectedSocket;



    return <div className="player">
         {/*
            3 divs in a flex col
            first div should contain the name 
            second div should contain the cards and the total, cards should be a div of it's own with flex row
            the second div should also have a flex row 
            third div should contain the buttons {hit or stand }
          */}
          <h2>{name}</h2>
          <div className="cards-total-container">
            <div className="cards">
                <Deck cards={cards}/>
            </div>
            <h3>{total}</h3>
          </div>
          {id === playerID && <span>Buttons</span>}
    </div>
}