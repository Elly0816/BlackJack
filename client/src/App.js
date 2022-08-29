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
  const [searching, setSearching] = useState(false);
  let socketSet;

  useEffect(()=>{
    const connectedSocket = io(endpoint);
    setSocket(connectedSocket);
  }, []);

  let timer;

  function socketSearch (){
    if (socket){
      setSearching(true);
      timer = setInterval(() => {
        socket.emit('search');
        if (startGame){
          clearInterval(timer);
        }
      }, 200);
      setSearching(true);
      // console.log(endpoint);
    }; 
  };

  // if (socket){
  //   socket.on('searching', () => {
  //   });
    
  // };

  if (socket){
    socket.on('sockets', (sockets) => {
      if(searching){
        let socketSet = new Set (sockets); //This includes all sockets excluding client's socket
        // console.log(socketSet);
        // console.log(socketSet.size);
        if (socketSet.size > 0){
          for (let other of socketSet){
            socket.emit('toConnect', other);
        };
      }
      }
      
      
    });
  };

  if (socket){
    socket.on('joined', () => {
      // console.log('joined Room');
      clearInterval(timer);
      setSearching(false);
      setStartGame(true);
    });
  }

  return (
    <div className="App">
      {startGame ? <Game timer={timer} socket={socket} start={startGame}/> : <Home 
                                          socketSearch={socketSearch} 
                                          searching={searching}/>}
    </div>
  );
}

export default App;


