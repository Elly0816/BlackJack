export default function Home (props){


    return <div className="home">
    {!props.searching ? <div className="home-item">
                <h2>WELCOME TO BLACKJACK</h2>
                <button onClick={props.socketSearch} className="search-button">Search for a game and join</button>
            </div> :
            <div className='main'>
                <span>Searching<img src={process.env.PUBLIC_URL+"back.png"} alt="circle"/></span>
            </div>}
    </div>
}