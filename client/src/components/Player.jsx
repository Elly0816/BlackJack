import Card from './Card';
import { useEffect, useState } from 'react';

export default function Player(props){

    
    const [cardFaces, setCardFaces] = useState([]);
    const [numOfCards, setNumOfCards] = useState();

    const [total, setTotal] = useState();

    useEffect(() => {
        if (props.cards.length !== numOfCards){
            setCardFaces(props.cards);
            setNumOfCards(props.cards.length);
            setTotal(props.countCards(props.cards));
        }
    }, [props.cards]);

    return <div className='player'>
            <span>{props.name}: {total}</span>
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
            </div>
        </div>
};


