import Card from './Card';
import { PlayerContext } from '../App';
import { useContext, useEffect, useState } from 'react';

export default function Player(props){



    const {playerCards, numPlayerCards} = useContext(PlayerContext);

    const [cardFaces, setCardFaces] = useState([...playerCards]);
    const [numOfCards, setNumOfCards] = useState(numPlayerCards);

    useEffect(() => {
        if (numPlayerCards !== numOfCards){
            setCardFaces([...playerCards]);
            setNumOfCards(numPlayerCards);
        }
    }, [numPlayerCards]);

    return <div className='player'>
            <span>Player 1</span>
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
        </div>
    </div>
}