import { useState, useEffect, useContext} from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Hit from './Hit';
import Stand from './Stand';
import Results from './Results';
import GoHome from './GoHome';
import { GameContext } from '../App';


export default function Table(props){

    const {startGame, setStartGame} = useContext(GameContext);
  
    const [deck, setDeck] = useState([]);
    const [showButtons, setShowButtons] = useState(false);
    const [result, setResult] = useState();
    const [game, setGame] = useState();
    const [ goHomeButton, setGoHomeButton] = useState(false);
    const [players, setPlayers ] = useState();
    const [dealer, setDealer] = useState();
    const [myTotal, setMyTotal] = useState();

    
    //On mount, get the shuffled cards.
    useEffect(() => {
        props.socket.on('game', game => {
            setGame(game);
            console.log(game);
            let {deck, dealer, players} = game;
            setDeck(deck);
            setDealer(dealer);
            setPlayers(players);
            for (let player of players){
              if (player.id === props.socket.id){
                setMyTotal(player.total);
                break;
              }
            }
            // setDeck(deck);
            // setNumInDeck(deck.length);
            // setDealerCards(dealer.cards);
            // setDealerTotal(dealer.total);
            // setBackCard(dealer.backCard);
            // for (const player of players){
            //     if (player.id === props.socket.id){
            //         setPlayerCards([...player.cards]);
            //         setLastPlay(player.lastPlay);
            //         setPlayerTotal(player.total);
            //     } else {
            //         setPlayer2Cards([...player.cards]);
            //         setPlayer2LastPlay(player.lastPlay);
            //         setPlayer2Total(player.total);
            //     }
            // }
        });
    }, []);

  props.socket.on('game state', game => {
      setGame(game);
      console.log(game);
      let {deck, dealer, players} = game;
      setDeck(deck);
      setDealer(dealer);
      setPlayers(players);
      for (let player of players){
        if (player.id === props.socket.id){
          setMyTotal(player.total);
          break;
        }
      }
      // setDeck(deck);
      // setNumInDeck(deck.length);
      // setDealerCards(dealer.cards);
      // setDealerTotal(dealer.total);
      // setBackCard(dealer.backCard);
      // for (const player of players){
      //     if (player.id === props.socket.id){
      //         setPlayerCards([...player.cards]);
      //         setLastPlay(player.lastPlay);
      //         setPlayerTotal(player.total);
      //     } else {
      //         setPlayer2Cards([...player.cards]);
      //         setPlayer2LastPlay(player.lastPlay);
      //         setPlayer2Total(player.total);
      //     }
      // }
  });

  props.socket.on('show buttons', () => {
    if (myTotal !== 'BlackJack' || myTotal !== 'Bust'){
      setShowButtons(true);
    }
    // for (let player of players){
    //   if(player.id === props.socket.id){
    //     if (player.total !== 'BlackJack' || player.total !== 'Bust'){
    //       setShowButtons(true);
    //     }
    //     break;
    //   }
    // }
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

  props.socket.on('go home', () => {
    console.log('go home');
    setShowButtons(false);
    setGoHomeButton(true);
  });

  function goHome(){
    setStartGame(false);
    props.socket.emit('game over');
  }


    return game && (result ? <Results result={result}/> : 
                      <div className='game'>
                          <Dealer cards={dealer.cards}
                          backCard={dealer.backCard}
                            total={dealer.total}
                              numInDeck={deck.length}
                            />
                            <div className='players-container'>
                              {players.map((player, index) => <Player name={player.id === props.socket.id ? 'My Total' : 'Opponent total'}
                                cards={player.cards}
                                total={player.total}
                                key = {index}
                              />)}
                                    {/* <Player name={'My total'} cards={playerCards} total={PlayerTotal}/>
                                    <Player name={'Opponent total'} cards={player2Cards} total={player2Total}/> */}
                            </div>

                            { showButtons && <div className='buttons'>
                                                  <Stand stand={stand}/>
                                                  <Hit hit={hit}/>
                                              </div>}
                            { goHomeButton && <div className='buttons'>
                                                <GoHome goHome={goHome}/>
                                              </div>}
                                            </div>)
};



// function countCards(cardList, firstBack=false){
//   let cardsToCount = [...cardList];
//   const values = { //Object that holds the values of each card
//     ace: 11,
//     2: 2,
//     3: 3,
//     4: 4,
//     5: 5,
//     6: 6,
//     7: 7,
//     8: 8,
//     9: 9,
//     10: 10,
//     jack: 10,
//     queen: 10,
//     king: 10
//   };
//   let cardValues = []; //Array that holds the value on each card
//   if (firstBack){
//       cardsToCount = cardsToCount.splice(1, 1);  
//   };
//   for (const card of cardsToCount){
//     const value = card.split('_')[0];
//     cardValues.push(value);
//   };
//   let total = 0;
//   for (const value of cardValues){
//     total += values[value];
//   };
//   if (total > 21 && cardValues.includes('ace')){
//     total -= 10;
//   } else if (total + 11 <= 21 && cardValues.includes('ace')){
//     total += 10;
//   };
//   return total;
// };

