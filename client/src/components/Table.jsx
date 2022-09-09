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
    // const [startGame, setStartGame] = useState();
    const [showButtons, setShowButtons] = useState(false);
    const [result, setResult] = useState();
    const [lastPlay, setLastPlay] = useState();
    const [player2LastPlay, setPlayer2LastPlay] = useState();
    const [game, setGame] = useState();

    //On mount, get the shuffled cards.
    useEffect(() => {
        props.socket.on('game', game => {
            setGame(game);
            console.log(game);
            let {deck, dealer, players} = game;
            setDeck(deck);
            setNumInDeck(deck.length);
            setDealerCards(dealer);
            for (const player of players){
                if (player.id === props.socket.id){
                    setPlayerCards([...player.cards]);
                    setLastPlay(player.lastPlay);
                } else {
                    setPlayer2Cards([...player.cards]);
                    setPlayer2LastPlay(player.lastPlay);
                }
            }
        });
    }, []);

  props.socket.on('game state', game => {
      setGame(game);
      console.log(game);
      let {deck, dealer, players} = game;
      setDeck(deck);
      setNumInDeck(deck.length);
      setDealerCards(dealer);
      for (const player of players){
          if (player.id === props.socket.id){
              setPlayerCards([...player.cards]);
              setLastPlay(player.lastPlay);
          } else {
              setPlayer2Cards([...player.cards]);
              setPlayer2LastPlay(player.lastPlay);
          }
      }
  });

  props.socket.on('show buttons', () => {
    setShowButtons(true);
  });

  props.socket.on('hide buttons', () => {
    setShowButtons(false);
  })

    //Stand and hit functions
  function stand() {
    props.socket.emit('stand');
  };

  function hit() {
    props.socket.emit('hit');
  };



    return result ? <Results result={result}/> : 
                      <div className='game'>
                          <Dealer cards={dealerCards}
                          backCard={backCard}
                            countCards={countCards}
                              numInDeck={numInDeck}
                            />
                            <div className='players-container'>
                                    <Player name={'My total'} cards={playerCards} countCards={countCards}/>
                                    <Player name={'Opponent total'} cards={player2Cards} countCards={countCards}/>
                            </div>

                            { showButtons && <div className='buttons'>
                                                  <Stand stand={stand}/>
                                                  <Hit hit={hit}/>
                                              </div>}
                                            </div>
};



function countCards(cardList, firstBack=false){
  let cardsToCount = [...cardList];
  const values = { //Object that holds the values of each card
    ace: 11,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    jack: 10,
    queen: 10,
    king: 10
  };
  let cardValues = []; //Array that holds the value on each card
  if (firstBack){
      cardsToCount = cardsToCount.splice(1, 1);  
  };
  for (const card of cardsToCount){
    const value = card.split('_')[0];
    cardValues.push(value);
  };
  let total = 0;
  for (const value of cardValues){
    total += values[value];
  };
  if (total > 21 && cardValues.includes('ace')){
    total -= 10;
  } else if (total + 11 <= 21 && cardValues.includes('ace')){
    total += 10;
  };
  return total;
};

