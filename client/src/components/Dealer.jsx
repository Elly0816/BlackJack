import Card from './Card';
import { useContext, useState, useEffect } from 'react';
import { DealerContext } from '../App';

export default function Dealer(){
     
    const {dealerCards, numDealerCards} = useContext(DealerContext);

    const [cardFaces, setCardFaces] = useState([]);

    const [numCards, setNumCards] = useState(0);

    useEffect(() => {
        if (numDealerCards !== numCards){
            setCardFaces([...dealerCards]);
            setNumCards(numDealerCards);
        }
    }, [numDealerCards])

    return <div className='dealer'>
            <span>Dealer</span>
            <div className='flex-container'>
                {Array.from({ length: numCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
            </div>
          </div>
}