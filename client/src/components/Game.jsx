import { useState, useEffect} from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Hit from './Hit';
import Stand from './Stand';
import Results from './Results';

export default function Game(props){

    //Do i really need the number of cards each player has?
  // const [shuffle, setShuffle] = useState(false);
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


  // This gets the shuffled cards from the server
  props.socket.on('shuffled', (arg) => {
    clearInterval(props.timer);
    setDeck(arg);
    setNumInDeck(arg.length);
    // props.socket.emit('start game');
  });

  //When tha cards have been dealt
  props.socket.on('game state', (arg) => {
    const {deck, dealer, players} = arg;
    setDeck(deck);
    setNumInDeck(deck.length);
    setDealerCards(dealer);
    setGame(arg);
    for (const player of players){
      if(player.id === props.socket.id){
        setPlayerCards(player.cards);
        setLastPlay(player.lastPlay);
      } else {
        setPlayer2Cards(player.cards);
        setPlayer2LastPlay(player.lastPlay);
      }
    };
    setStartGame(true);
    
  });

  useEffect(()=>{
    if(playerCards.length === 0 && startGame && player2Cards.length > 0){
      setShowButtons(false);
    }

    if(countCards(dealerCards, setBackCard) > 21 && playerCards.length === 0 && player2Cards.length === 0 && !backCard){
      setResult('tie');
      console.log('tie');
    }

    if (playerCards.length === 0 && player2Cards.length === 0 && deck.length !== 0){
      setShowButtons(false);
      if(backCard){
        setBackCard(false)
      } else {
        if(countCards(dealerCards, backCard) < 17){
          setTimeout(() => {
            // setBackCard(false);
            // console.log("dealer total below 17");
          props.socket.emit('both bust', props.socket.id);
        }, 500);
        } else {
            setResult('dealer win')
        }
      }
      // setBackCard(false);
      
    }
      if(countCards(playerCards) === 21){//If any player has 21 cards after dealing
        console.log(' mytotal is 21');
        if (player2Cards.length !== 0){
          setShowButtons(false);
        };
        setTimeout(() => {
          setBackCard(false);
          if (countCards(dealerCards) < 17){
              setTimeout(() => {
                // setBackCard(false);
                console.log("dealer total below 17");
              props.socket.emit('player 21', props.socket.id);
            }, 500);
          }}, 800);
        //Set a win state
      };
      if(countCards(playerCards) >= 21){
        if (player2Cards.length !== 0){
          setShowButtons(false);
        };
        console.log('total is over 21');
        props.socket.emit('over 21', props.socket.id);
      };
      if (countCards(playerCards) === 21){
        if (countCards(dealerCards) < 17){
          props.socket.emit('player 21', props.socket.id);
      } else if (countCards(dealerCards) > countCards(playerCards) || countCards(dealerCards) < countCards(playerCards)){
        props.socket.emit('player wins', props.socket.id);
        console.log('player wins');
      } else {
        props.socket.emit('player and dealer tie', props.socket.id);
        console.log('player and dealer tie');
      }
      };

      if (player2LastPlay === 'stand' && lastPlay === 'stand'){
        setShowButtons(false);
        setBackCard(false);
        props.setTimeout(() => {
          if(countCards(dealerCards, backCard) < 17){
            props.socket.emit('both stand');
          } else if ((countCards(dealerCards, backCard) === 21) && countCards(playerCards) === 21 && countCards(player2Cards) === 21){
            setResult('tie');
  
          } else if (countCards(dealerCards) >= 17 && countCards(dealerCards) < 21){
            if (countCards(playerCards) > countCards(dealerCards)){
              props.socket.emit('player wins');
              setResult('win');
            } else if (countCards(playerCards) < countCards(dealerCards)){
              setResult('lose');
            }
          }
        }, 2000);
        
      }

  }, [player2Cards, playerCards, lastPlay, player2LastPlay, game]);


  // useEffect(() => {
  //   if (playerCards.length === 0){
  //     setShowButtons(false);
  //   };
  // }, [playerCards])


  //Function to execute hit
  function hit(){
    if (player2Cards.length !== 0){
      setShowButtons(false);
    };
    props.socket.emit('hit', props.socket.id);
  };

  //function to execute stand
  function stand(){
    if (player2Cards.length !== 0){
      setShowButtons(false);
      props.socket.emit('stand', props.socket.id);
    } else {
      props.socket.emit('stand', props.socket.id);
    }
  };

  props.socket.on('show buttons', () => {
    if (playerCards.length > 0){
      setShowButtons(true);
    }
    
  });

  props.socket.on('hide buttons', () => {
    if (player2Cards.length !== 0){
      setShowButtons(false);
    };
  });





    return  result ? <Results result={result}/> : 
                      <div className='game'>
                          <Dealer cards={dealerCards}
                          backCard={backCard}
                            countCards={countCards}
                              numInDeck={numInDeck}
                            />
                            <div className='players-container'>
                                    <Player start={startGame} name={'My total'} cards={playerCards} countCards={countCards}/>
                                    <Player start={startGame} name={'Opponent total'} cards={player2Cards} countCards={countCards}/>
                            </div>

                            { showButtons && <div className='buttons'>
                                                  <Stand stand={stand}/>
                                                  <Hit hit={hit}/>
                                              </div>}
                                            </div>
};


//Get images in folder and add them to an object
// function importAll(r) {
//   let images = {};
//   r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
//   return images;
// }

// const images = importAll(require.context('../../public/PNG-cards-1.3', false, /\.(png|jpe?g|svg)$/));

// const imageList = [];

//push the object keys to an array
// for (let image in images){
  // imageList.push(image);
// }

//Function to count the cards held
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









  

  // //This function deals a card to the player
  // function hitPlayer(){
  //   let playerCardList = [...playerCards];
  //   playerCardList.push(deck.pop());
  //   setPlayerCards([...playerCardList]);
  //   // setNumOfPlayerCards(playerCardList.length);
  //   setNumInDeck(numInDeck - 1);

  // }


  // function dealCards(){//Draw two cards for the player and one for the dealer
  //   setToDeal(false);
  //   setNumInDeck(imageList.length);
  //   let dealerCardList = [...dealerCards]; //Holds the dealer cards for use in loop
  //   for(let i=0; i<2; i++){
  //     dealerCardList.push(deck.pop());
  //     setDeck(deck.slice(0, deck.length));
  //     setNumInDeck(deck.length);
  //   };
  //   // console.log(`DealerCardList: ${dealerCardList}`);
  //   setDealerCards([...dealerCardList]);
  //   setBackCard(true);
  //   // setNumOfDealerCards(dealerCardList.length);

  //   let playerCardList = [...playerCards]; //Holds the player cards for use in loop
  //   for (let i=0; i<2; i++){
  //     playerCardList.push(deck.pop());
  //     setDeck(deck.slice(0, deck.length));
  //     setNumInDeck(deck.length);
  //   };
  //   // console.log(`PlayerCardList: ${playerCardList}`);
  //   setPlayerCards([...playerCardList]);
  //   // setNumOfPlayerCards(playerCardList.length);

  //   if (countCards(dealerCards, true) === 21){//Check for dealer win
        
  //   }

  // }

  // useEffect(()=> {
  //   if (!shuffle){
  //     setShuffle(true);
  //     shuffleDeck();
  //   }
  //   console.log(props.socket);
  //   // if(numInDeck > 48){
  //   //   const draw = setInterval(() => {
  //   //     drawCards();
  //   //   }, 500);
  //   //   return () => {
  //   //     clearInterval(draw);
  //   //   }
  //   // }
  // });