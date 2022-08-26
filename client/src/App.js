import './App.css';
import Game from './components/Game';
import Home from './components/Home';
import {useState} from 'react';

function App() {

  const [startGame, setStartGame] = useState(false);

  return (
    <div className="App">
      {startGame ? <Game start={startGame}/> : <Home start={startGame}/>}
    </div>
  );
}

export default App;


