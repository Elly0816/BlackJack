import React, { useState, ReactElement, useContext, useRef } from "react";
import { searchingContext } from "../../contexts/searchingContext";
import { searchButtonHandler } from "../../buttonHandlers/searchButtonHandler";
import './Home.css';

export default function Home():ReactElement{
    const [name, setName] = useState<string>('');
    const audioRef = useRef<HTMLAudioElement>(null);

    // const [searching, setSearching] = useState<boolean>(false);
    const {searching, setSearching} = useContext(searchingContext);  
    
    let toReturn:ReactElement;

    const clickToPlayAudio:()=>void = () => {
        if(audioRef.current){
            if(audioRef.current.currentTime === 0){
                audioRef.current.play()
                .catch(e => console.log(`There was an issue playing the audio:\n${e}`));
            }
        }
    }

    // let casino = new Audio(CONSTANTS.CasinoAudio);
    // casino.play();

    const AudioDiv = ({children}:{children:ReactElement}):ReactElement => {
        
        
        let toReturn = <div className='main audio-div'>{children}</div> 
        
        
        return  <div className="home-item" onClick={clickToPlayAudio}>{toReturn}</div>
    }


    if(!searching){
        toReturn = <AudioDiv >
                    <>
                    <h2>WELCOME TO BLACKJACK</h2>
                    <audio loop ref={audioRef} src='/Casino_ambience.mp3'/>
                    <form className='form'>
                    <input placeholder="Type your name here" type="text" name="name" value={name} onChange={(e) => {
                        console.log(`This is the current name ${name}`);
                        setName(e.target.value)}}/>
                    <button type='submit' onClick={ (e) => {
                        e.preventDefault();
                        searchButtonHandler(name, setSearching)
                        }} className="search-button">Search for a game and join</button>
                    </form>
                </>
        </AudioDiv>
    
    } else {
        toReturn = <AudioDiv>
                        <span>Searching<img src={process.env.PUBLIC_URL+"back.png"} alt="circle"/></span>
                    </AudioDiv>
    }


    return <div className="home">
            {toReturn}
    </div>

}