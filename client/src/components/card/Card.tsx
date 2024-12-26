import { CardType } from "../../types/gameType/gameFromServerType";
import getNameFromCard from "../../utilities/Utilities";
import React, { ReactElement } from 'react';
import './Card.css';

export default function Card(props:CardType):ReactElement {


    const imgURL = getNameFromCard(props);

    return  <div className="card">
                <img src={imgURL} alt={imgURL}/>
            </div>
}