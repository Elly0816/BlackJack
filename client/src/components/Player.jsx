import Card from './Card';
import { PlayerContext } from '../App.js';
import { useContext, useEffect, useState } from 'react';

export default function Player(props){



    const {numOfPlayerCards, playerCards, countCards} = useContext(PlayerContext);

    const [cardFaces, setCardFaces] = useState([]);
    const [numOfCards, setNumOfCards] = useState();

    const [total, setTotal] = useState();

    useEffect(() => {
        if (numOfPlayerCards !== numOfCards){
            setCardFaces(playerCards);
            setNumOfCards(numOfPlayerCards);
            setTotal(countCards(playerCards));
        }
    }, [numOfPlayerCards]);

    return <div className='player'>
            <span>Player 1: {total}</span>
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
        </div>
    </div>
}