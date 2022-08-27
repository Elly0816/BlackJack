export default function Home (props){


    return <div className="home">
            <div className="home-item">
                <h2>WELCOME TO BLACKJACK</h2>
                <button onClick={props.socketConnect} className="search-button">Search for a game and join</button>
            </div>
        
    </div>
}