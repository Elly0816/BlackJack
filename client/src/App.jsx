import './App.css';
import Table from './components/Table';
import Home from './components/Home';
import { useState, useEffect, createContext } from 'react';
import { connectedSocket } from './socket';
import useFetch from './hooks/useFetch';
function App() {
  //When the user clicks to start a game,
  //io opens a connection on the server and connects to another free connection
  //When a connection is found, startgame is set to true

  // const development = 'http://localhost:5000/';
  // const production = 'https://polar-harbor-23442.herokuapp.com/';

  // const endpoint = process.env.NODE_ENV ? production : development;
  const [socket, setSocket] = useState();
  const [startGame, setStartGame] = useState(false);
  const [searching, setSearching] = useState(false);
  // let socketSet;

  const { data } = useFetch();

  useEffect(() => {
    if (data) {
      setSocket(connectedSocket);
    }
  }, [data]);
  let timer;

  function socketSearch(name) {
    if (socket) {
      setSearching(true);
      timer = setInterval(() => {
        socket.emit('search', name);
        if (startGame) {
          clearInterval(timer);
        }
      }, 200);
      setSearching(true);
      setTimeout(() => {
        if (!startGame) {
          clearInterval(timer);
          setSearching(false);
        }
      }, 20000);
      // console.log(endpoint);
    }
  }

  // if (socket){
  //   socket.on('searching', () => {
  //   });

  // };

  // if (socket){
  //   socket.on('sockets', (sockets) => {
  //     if(searching){
  //       let socketSet = new Set (sockets); //This includes all sockets excluding client's socket
  //       // console.log(socketSet);
  //       // console.log(socketSet.size);
  //       if (socketSet.size > 0){
  //         for (let other of socketSet){
  //           socket.emit('toConnect', other);
  //       };
  //     }
  //     }

  //   });
  // };

  if (socket) {
    socket.on('game', () => {
      // console.log('joined Room');
      clearInterval(timer);
      setSearching(false);
      setStartGame(true);
    });

    if (socket) {
      socket.on('waiting', () => {
        clearInterval(timer);
      });
    }
  }

  return (
    <GameContext.Provider value={{ startGame, setStartGame }}>
      <div className="App">
        {startGame ? (
          <Table socket={socket} start={startGame} />
        ) : (
          <Home socketSearch={socketSearch} searching={searching} />
        )}
      </div>
    </GameContext.Provider>
  );
}

export default App;

export const GameContext = createContext();
