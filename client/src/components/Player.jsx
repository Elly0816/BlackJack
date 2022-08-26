import Card from './Card';
import { PlayerContext } from './Game.jsx';
import { useContext, useEffect, useState } from 'react';

export default function Player(props){



    const {playerCards, countCards} = useContext(PlayerContext);

    const [cardFaces, setCardFaces] = useState([]);
    const [numOfCards, setNumOfCards] = useState();

    const [total, setTotal] = useState();

    useEffect(() => {
        if (playerCards.length !== numOfCards){
            setCardFaces(playerCards);
            setNumOfCards(playerCards.length);
            setTotal(countCards(playerCards));
        }
    }, [playerCards]);

    return <div className='player'>
            <span>Player 1: {total}</span>
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
            </div>
        </div>
}