import { useState, useEffect, useContext } from "react";
import Dealer from "./Dealer";
import Player from "./Player";
import Hit from "./Hit";
import Stand from "./Stand";
import Results from "./Results";
import GoHome from "./GoHome";
import { GameContext } from "../App";

export default function Table(props) {
  const { startGame, setStartGame } = useContext(GameContext);

  const [deck, setDeck] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [result, setResult] = useState();
  const [game, setGame] = useState();
  const [goHomeButton, setGoHomeButton] = useState(false);
  const [players, setPlayers] = useState();
  const [dealer, setDealer] = useState();
  const [myTotal, setMyTotal] = useState();

  //On mount, get the shuffled cards.
  useEffect(() => {
    props.socket.on("game", (game) => {
      setGame(game);
      console.log(game);
      let { deck, dealer, players } = game;
      setDeck(deck);
      setDealer(dealer);
      setPlayers(players);
      for (let player of players) {
        if (player.id === props.socket.id) {
          setMyTotal(player.total);
          break;
        }
      }
    });
  }, []);

  props.socket.on("game state", (game) => {
    setGame(game);
    console.log(game);
    let { deck, dealer, players } = game;
    setDeck(deck);
    setDealer(dealer);
    setPlayers(players);
    for (let player of players) {
      if (player.id === props.socket.id) {
        setMyTotal(player.total);
        break;
      }
    }
  });

  props.socket.on("show buttons", () => {
    if (myTotal !== "BlackJack" || myTotal !== "Bust") {
      setShowButtons(true);
    }
  });

  props.socket.on("hide buttons", () => {
    setShowButtons(false);
  });

  //Stand and hit functions
  function stand() {
    props.socket.emit("stand");
  }

  function hit() {
    props.socket.emit("hit");
  }

  props.socket.on("go home", () => {
    console.log("go home");
    setShowButtons(false);
    setGoHomeButton(true);
  });

  function goHome() {
    setStartGame(false);
    props.socket.emit("game over");
  }

  return (
    game &&
    (result ? (
      <Results result={result} />
    ) : (
      <div className="game">
        <Dealer
          cards={dealer.cards}
          backCard={dealer.backCard}
          total={dealer.total}
          numInDeck={deck.length}
        />
        <div className="players-container">
          {players.map((player, index) => (
            <Player
              name={
                player.id === props.socket.id ? "My Total" : "Opponent total"
              }
              cards={player.cards}
              total={player.total}
              key={index}
            />
          ))}
        </div>

        {showButtons && (
          <div className="buttons">
            <Stand stand={stand} />
            <Hit hit={hit} />
          </div>
        )}
        {goHomeButton && (
          <div className="buttons">
            <GoHome goHome={goHome} />
          </div>
        )}
      </div>
    ))
  );
}
