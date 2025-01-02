import React, { useState, ReactElement, useContext } from 'react';
import { searchingContext } from '../../contexts/searchingContext';
import { searchButtonHandler } from '../../buttonHandlers/searchButtonHandler';
import './Home.css';
import AudioDiv from '../../components/audioDiv/AudioDiv';

export default function Home(): ReactElement {
  const [name, setName] = useState<string>('');

  const { searching, setSearching } = useContext(searchingContext);

  let toReturn: ReactElement;

  toReturn = (
    <AudioDiv>
      {searching ? (
        <span>
          Searching
          <img src={process.env.PUBLIC_URL + 'back.png'} alt="circle" />
        </span>
      ) : (
        <>
          <h2 className="md:text-5xl">WELCOME TO BLACKJACK</h2>
          <form className="form w-6/12">
            <input
              className="w-5/6"
              autoFocus
              placeholder="Type your name here"
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                console.log(`This is the current name ${name}`);
                setName(e.target.value);
              }}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                searchButtonHandler(name, setSearching);
              }}
              className="search-button bg-gray-500 text-white hover:shadow-md shadow-slate-50 w-5/6 py-10"
            >
              Search for a game and join
            </button>
          </form>
        </>
      )}
    </AudioDiv>
  );

  return <div className="home">{toReturn}</div>;
}
