import Card from './Card';
import { useContext, useState, useEffect } from 'react';
import { DealerContext } from './Game.jsx';

export default function Dealer(){
     
    const {dealerCards, numInDeck, countCards, backCard} = useContext(DealerContext);

    const [cardFaces, setCardFaces] = useState([]);

    const [numCards, setNumCards] = useState();

    const [total, setTotal] = useState();

    useEffect(() => {
        if (dealerCards.length !== numCards){
            setCardFaces(dealerCards);
            setNumCards(dealerCards.length);
            setTotal(countCards(dealerCards, backCard));
        }
    }, [dealerCards]);

    return <div className='dealer'>
            <span>Dealer: {total}</span>
            <div className='flex-container'>
                {Array.from({ length: numCards}, ((item, index) => index === 0 ? 
                <Card face={'back.png'} key={index}/>
                : <Card face={cardFaces[index]} key={index}/>))}
            </div>
            <Card numDeck={numInDeck} face={'deck'}/>
          </div>
}