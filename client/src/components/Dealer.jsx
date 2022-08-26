import Card from './Card';
import { useContext, useState, useEffect } from 'react';
import { DealerContext } from '../App.js';

export default function Dealer(){
     
    const {dealerCards, numOfDealerCards, numInDeck, countCards} = useContext(DealerContext);

    const [cardFaces, setCardFaces] = useState([]);

    const [numCards, setNumCards] = useState();

    const [total, setTotal] = useState();

    const [firstBack, setFirstBack] = useState(true);


    useEffect(() => {
        if (numOfDealerCards !== numCards){
            setCardFaces(dealerCards);
            setNumCards(numOfDealerCards);
            setTotal(countCards(dealerCards, firstBack));
        }
    }, [numOfDealerCards]);

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