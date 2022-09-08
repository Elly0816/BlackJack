import { useState, useEffect} from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Hit from './Hit';
import Stand from './Stand';
import Results from './Results';


export default function Table(props){

    const [deck, setDeck] = useState([]);
    const [numInDeck, setNumInDeck] = useState(deck.length);
    const [dealerCards, setDealerCards] = useState([]);
    // const [numOfDealerCards, setNumOfDealerCards] = useState(dealerCards.length);
    const [playerCards, setPlayerCards] = useState([]);
    const [player2Cards, setPlayer2Cards] = useState([]);
    // const [numOfPlayerCards, setNumOfPlayerCards] = useState(playerCards.length);
    const [backCard, setBackCard] = useState(true);
    const [gameOver, setGameOver] = useState();
    const [startGame, setStartGame] = useState();
    const [showButtons, setShowButtons] = useState(true);
    const [result, setResult] = useState();
    const [lastPlay, setLastPlay] = useState();
    const [player2LastPlay, setPlayer2LastPlay] = useState();
    const [game, setGame] = useState();


    



    return result ? <Results result={result}/> : 
                      <div className='game'>
                          {/* <Dealer cards={dealerCards}
                          backCard={backCard}
                            countCards={countCards}
                              numInDeck={numInDeck}
                            />
                            <div className='players-container'>
                                    <Player start={startGame} name={'My total'} cards={playerCards} countCards={countCards}/>
                                    <Player start={startGame} name={'Opponent total'} cards={player2Cards} countCards={countCards}/>
                            </div> */}

                            {/* { showButtons && <div className='buttons'>
                                                  <Stand stand={stand}/>
                                                  <Hit hit={hit}/>
                                              </div>} */}
                                            </div>
}