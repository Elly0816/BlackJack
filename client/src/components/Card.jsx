export default function Card (props){
    const folder = './PNG-cards-1.3';

    console.log(`background image: ${folder}/${props.face}`);

    const imgUrl = `${folder}/${props.face}`;

    return props.face === 'deck' ? 
    <div className="deck">
        <img className="back" src='./back.png' alt={'back of card'}/>
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