import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
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
    return shuffled;
  }

  console.log(`deck: ${deck}\n length: ${deck.length}`);

  function drawCards(){//Draw two cards for the player and one for the dealer
    setDeck(shuffleDeck());
    setNumInDeck(imageList.length);
    for(let i=0; i<1; i++){
      setDealerCards([...dealerCards, deck.pop()]);
      setDeck(deck.slice(0, deck.length));
      setNumInDeck(deck.length);
      setNumOfDealerCards(numOfDealerCards + 1);
    }
    for (let i=0; i<2; i++){
      setPlayerCards([...playerCards, deck.pop()]);
      setDeck(deck.slice(0, deck.length));
      setNumInDeck(deck.length);
      setNumOfPlayerCards(numOfPlayerCards +1);
    }
  }

  useEffect(()=> {
    drawCards();
  }, []);

  return (
    <div className="App">
      <DealerContext.Provider value={{dealerCards, numOfDealerCards}}>
        <Dealer/>
      </DealerContext.Provider>

      <PlayerContext.Provider value={{playerCards, numOfPlayerCards}}>
        <Player/>
      </PlayerContext.Provider>
    </div>
  );
}

export default App;


export const DealerContext = createContext();
export const PlayerContext = createContext();