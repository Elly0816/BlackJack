import './App.css';
import Dealer from './components/Dealer';
import Player from './components/Player';
import { useState, createContext, useEffect} from 'react';


function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('../public', false, /\.(png|jpe?g|svg)$/));

const imageList = [];

for (let image of images){
  imageList.push(image);
}

console.log(imageList);

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;


export const DealerContext = createContext();
export const PlayerContext = createContext();