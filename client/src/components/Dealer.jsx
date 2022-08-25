import Card from './Card';
import { useContext, useState, useEffect } from 'react';
import { DealerContext } from '../App.js';

export default function Dealer(){
     
    const {dealerCards, numOfDealerCards} = useContext(DealerContext);

    const [cardFaces, setCardFaces] = useState([]);

    const [numCards, setNumCards] = useState();

    useEffect(() => {
        if (numOfDealerCards !== numCards){
            setCardFaces(dealerCards);
            setNumCards(numOfDealerCards);
        }
    }, [numOfDealerCards]);

    return <div className='dealer'>
            <span>Dealer</span>
            <div className='flex-container'>
                {Array.from({ length: numCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
            </div>
          </div>
}