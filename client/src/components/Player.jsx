import Card from './Card';
import { useEffect, useState, useContext} from 'react';
import { GameContext } from '../App'

export default function Player(props){

    const {start, setStart} = useContext(GameContext);

    
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
            {(total === 0 && start) ? <h1>BUST</h1> : 
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
            </div>
            }
            
        </div>
};

