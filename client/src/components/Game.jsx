import { useState, useEffect} from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Hit from './Hit';
import Stand from './Stand';
import Deal from './Deal';

export default function Game(props){

    //Do i really need the number of cards each player has?
  const [shuffle, setShuffle] = useState(false);
  const [deck, setDeck] = useState([...imageList]);
  const [numInDeck, setNumInDeck] = useState(deck.length);
  const [dealerCards, setDealerCards] = useState([]);
  // const [numOfDealerCards, setNumOfDealerCards] = useState(dealerCards.length);
  const [playerCards, setPlayerCards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  // const [numOfPlayerCards, setNumOfPlayerCards] = useState(playerCards.length);
  const [backCard, setBackCard] = useState(false);
  const [gameOver, setGameOver] = useState();
  const [startGame, setStartGame] = useState();
  const [toDeal, setToDeal] = useState(true);


  function shuffleDeck(){ //This shuffles the deck
    let shuffled = imageList
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
      // console.log(`shuffled: ${shuffled}`);
    setDeck(shuffled);
  }

  //This function deals a card to the player
  function hitPlayer(){
    let playerCardList = [...playerCards];
    playerCardList.push(deck.pop());
    setPlayerCards([...playerCardList]);
    // setNumOfPlayerCards(playerCardList.length);
    setNumInDeck(numInDeck - 1);

  }


  function dealCards(){//Draw two cards for the player and one for the dealer
    setToDeal(false);
    setNumInDeck(imageList.length);
    let dealerCardList = [...dealerCards]; //Holds the dealer cards for use in loop
    for(let i=0; i<2; i++){
      dealerCardList.push(deck.pop());
      setDeck(deck.slice(0, deck.length));
      setNumInDeck(deck.length);
    };
    // console.log(`DealerCardList: ${dealerCardList}`);
    setDealerCards([...dealerCardList]);
    setBackCard(true);
    // setNumOfDealerCards(dealerCardList.length);

    let playerCardList = [...playerCards]; //Holds the player cards for use in loop
    for (let i=0; i<2; i++){
      playerCardList.push(deck.pop());
      setDeck(deck.slice(0, deck.length));
      setNumInDeck(deck.length);
    };
    // console.log(`PlayerCardList: ${playerCardList}`);
    setPlayerCards([...playerCardList]);
    // setNumOfPlayerCards(playerCardList.length);

    if (countCards(dealerCards, true) === 21){//Check for dealer win
        
    }

  }

  useEffect(()=> {
    if (!shuffle){
      setShuffle(true);
      shuffleDeck();
    }
    console.log(props.socket);
    // if(numInDeck > 48){
    //   const draw = setInterval(() => {
    //     drawCards();
    //   }, 500);
    //   return () => {
    //     clearInterval(draw);
    //   }
    // }
  });


    return <div className='game'>
                <Dealer cards={dealerCards}
                 backCard={backCard}
                  countCards={countCards}
                    numInDeck={numInDeck}
                  />
            <div className='players-container'>
                    <Player name={'Your total'} cards={playerCards} countCards={countCards}/>
                    <Player name={'Player 2 total'} cards={player2Cards} countCards={countCards}/>
            </div>
            
            <div className='buttons'>
                {toDeal && <Deal deal={dealCards}/>}
                <Stand/>
                <Hit hit={hitPlayer}/>
            </div>
        </div>
};


//Get images in folder and add them to an object
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../../public/PNG-cards-1.3', false, /\.(png|jpe?g|svg)$/));

const imageList = [];

//push the object keys to an array
for (let image in images){
  imageList.push(image);
}

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
    total -= 11;
  } else if (total + 11 <= 21 && cardValues.includes('ace')){
    total += 11;
  };
  return total;
};