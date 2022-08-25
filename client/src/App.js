import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
import Hit from './components/Hit';
import Stand from './components/Stand';
import { useState, createContext, useEffect} from 'react';

//Get images in folder and add them to an object
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../public/PNG-cards-1.3', false, /\.(png|jpe?g|svg)$/));

const imageList = [];

//push the object keys to an array
for (let image in images){
  imageList.push(image);
}


function App() {

  const [shuffle, setShuffle] = useState(false);
  const [deck, setDeck] = useState([...imageList]);
  const [numInDeck, setNumInDeck] = useState(deck.length);
  const [dealerCards, setDealerCards] = useState([]);
  const [numOfDealerCards, setNumOfDealerCards] = useState(dealerCards.length);
  const [playerCards, setPlayerCards] = useState([]);
  const [numOfPlayerCards, setNumOfPlayerCards] = useState(playerCards.length);

  function shuffleDeck(){ //This shuffles the deck
    let shuffled = imageList
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
      console.log(`shuffled: ${shuffled}`);
    setDeck(shuffled);
  }

  console.log(`deck: ${deck}\n length: ${deck.length}`);
  console.log(dealerCards, playerCards);

  function drawCards(){//Draw two cards for the player and one for the dealer
    setNumInDeck(imageList.length);
    let dealerCardList = [...dealerCards];
    for(let i=0; i<1; i++){
      dealerCardList.push(deck.pop());
      setDeck(deck.slice(0, deck.length));
      setNumInDeck(deck.length);
    };
    console.log(`DealerCardList: ${dealerCardList}`);
    setDealerCards([...dealerCardList]);
    setNumOfDealerCards(dealerCardList.length);

    let playerCardList = [...playerCards];
    for (let i=0; i<2; i++){
      playerCardList.push(deck.pop());
      setDeck(deck.slice(0, deck.length));
      setNumInDeck(deck.length);
    };
    console.log(`PlayerCardList: ${playerCardList}`);
    setPlayerCards([...playerCardList]);
    setNumOfPlayerCards(playerCardList.length);

  }

  useEffect(()=> {
    if (!shuffle){
      setShuffle(true);
      shuffleDeck();
    }
    if(numInDeck > 49){
      const draw = setInterval(() => {
        drawCards();
      }, 500);
      return () => {
        clearInterval(draw);
      }
    }
  });

  return (
    <div className="App">
      <DealerContext.Provider value={{dealerCards, numOfDealerCards}}>
        <Dealer/>
      </DealerContext.Provider>

      <PlayerContext.Provider value={{playerCards, numOfPlayerCards}}>
        <Player/>
      </PlayerContext.Provider>
      <div className='buttons'>
        <Hit/>
        <Stand/>
      </div>
    </div>
  );
}

export default App;


export const DealerContext = createContext();
export const PlayerContext = createContext();