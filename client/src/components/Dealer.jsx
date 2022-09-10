import Card from './Card';
import { useState, useEffect } from 'react';

export default function Dealer(props){
     

    const [cardFaces, setCardFaces] = useState([]);

    const [numCards, setNumCards] = useState();


    useEffect(() => {
        if (props.cards.length !== numCards){
            setCardFaces(props.cards);
            setNumCards(props.cards.length);
        }
    }, [props.cards]);

    return <div className='dealer'>
            <span>Dealer: {props.total}</span>
            <div className='flex-container'>
                {Array.from({ length: numCards}, ((item, index) => (props.backCard && index === 0) ? 
                <Card face={'back.png'} key={index}/>
                : <Card face={cardFaces[index]} key={index}/>))}
            </div>
            <Card numDeck={props.numInDeck} face={'deck'}/>
          </div>
}