import React, { useState, ReactElement, useContext } from "react";
import { searchingContext } from "../contexts/searchingContext";
import { searchButtonHandler } from "../buttonHandlers/searchButtonHandler";

export default function Home():ReactElement{
    const [name, setName] = useState<string>('');

    // const [searching, setSearching] = useState<boolean>(false);
    const {searching, setSearching} = useContext(searchingContext);  
    
    let toReturn:ReactElement;

    if(!searching){
        toReturn = <div className="home-item">
        <h2>WELCOME TO BLACKJACK</h2>
        <form >
        <input placeholder="Type your name here" type="text" name="name" value={name} onChange={(e) => {
            console.log(`This is the current name ${name}`);
            setName(e.target.value)}}/>
        <button onClick={ (e) => {
            e.preventDefault();
            searchButtonHandler(name, setSearching)
            }} className="search-button">Search for a game and join</button>
        </form>
    </div>
    } else {
        toReturn = <div className='main'>
        <span>Searching<img src={process.env.PUBLIC_URL+"back.png"} alt="circle"/></span>
    </div>
    }


    return <div className="home">
            {toReturn}
    </div>

}