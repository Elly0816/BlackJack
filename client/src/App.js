import './App.css';
import Game from './components/Game';
import Home from './components/Home';
import {useState} from 'react';

function App() {

  const [startGame, setStartGame] = useState(true);

  return (
    <div className="App">
      {startGame ? <Game/> : <Home/>}
    </div>
  );
}

export default App;


