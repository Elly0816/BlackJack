import Card from './Card';
import { PlayerContext } from '../App.js';
import { useContext, useEffect, useState } from 'react';

export default function Player(props){



    const {numOfPlayerCards, playerCards} = useContext(PlayerContext);

    const [cardFaces, setCardFaces] = useState([...playerCards]);
    const [numOfCards, setNumOfCards] = useState(numOfPlayerCards);

    useEffect(() => {
        if (numOfPlayerCards !== numOfCards){
            setCardFaces([...playerCards]);
            setNumOfCards(numOfPlayerCards);
        }
    }, [numOfPlayerCards]);

    return <div className='player'>
            <span>Player 1</span>
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
        </div>
    </div>
}