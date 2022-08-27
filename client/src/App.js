import './App.css';
import Game from './components/Game';
import Home from './components/Home';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {io} from 'socket.io-client';

function App() {
  //When the user clicks to start a game, 
  //io opens a connection on the server and connects to another free connection
  //When a connection is found, startgame is set to true

  const endpoint = process.env.NODE_ENV ? process.env.REACT_APP_DEV_NODE_ENV : null;
  const [socket, setSocket] = useState();
  const [startGame, setStartGame] = useState(false);

  function socketConnect (){
    if (!socket){
      setSocket(io(endpoint));
      console.log(endpoint);
    }; 
  };

  useEffect(() => {
    if (socket?.connected){
      setStartGame(true);
    }
  }, [socket]);


  return (
    <div className="App">
      {startGame ? <Game socket={socket} start={startGame}/> : <Home 
                                          socketConnect={socketConnect}/>}
    </div>
  );
}

export default App;


