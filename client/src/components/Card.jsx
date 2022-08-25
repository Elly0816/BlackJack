export default function Card (props){
    const folder = './PNG-cards-1.3';

    console.log(`background image: ${folder}/${props.face}`);

    const imgUrl = `${folder}/${props.face}`;

    return props.face === 'back' ? <div className="card back"></div> :
    <div className="card">
        <img className="face" src={imgUrl} alt={props.face}/>
    </div>
}