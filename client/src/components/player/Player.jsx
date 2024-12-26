import Card from './card/Card';
import { useEffect, useState, useContext} from 'react';
import { GameContext } from '../App'

export default function Player(props){

    const {start, setStart} = useContext(GameContext);

    
    const [cardFaces, setCardFaces] = useState([]);
    const [numOfCards, setNumOfCards] = useState();


    useEffect(() => {
        if (props.cards.length !== numOfCards){
            setCardFaces(props.cards);
            setNumOfCards(props.cards.length);
        }
    }, [props.cards]);

    return <div className='player'>
            <span>{props.name}: {props.total}</span>
            {(props.total === 0 && start) ? <h1>BUST</h1> : 
            <div className="flex-container">
                { Array.from({length: numOfCards}, ((item, index) => <Card face={cardFaces[index]} key={index}/>))}
            </div>
            }
            
        </div>
};

