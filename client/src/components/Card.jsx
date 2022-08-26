import {useState, useEffect} from 'react';

export default function Card (props){

    const [numDeck, setNumDeck] = useState(props.numDeck);

    useEffect(() => {
        setNumDeck(props.numDeck);
    }, [props.numDeck]);

    const folder = './PNG-cards-1.3';

    // console.log(`background image: ${folder}/${props.face}`);

    const imgUrl = `${folder}/${props.face}`;

    return props.face === 'deck' ? 
    <div className="deck">
        <img className="back" src='./back.png' alt={'back of card'}/>
        <span className='centered'>{numDeck}</span>
    </div> 
    : 
    props.face === 'back.png' ? 
    <div className="card">
        <img className="face" src={'./back.png'} alt={props.face}/>
    </div>
    :
    <div className="card">
        <img className="face" src={imgUrl} alt={props.face}/>
    </div>
}