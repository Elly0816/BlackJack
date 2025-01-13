import React, {
  useState,
  ReactElement,
  useContext,
  useCallback,
  // useEffect,
} from 'react';
import { searchingContext } from '../../contexts/searchingContext';
import { searchButtonHandler } from '../../buttonHandlers/searchButtonHandler';
import './Home.css';
import AudioDiv from '../../components/audioDiv/AudioDiv';

export default function Home(): ReactElement {
  const [name, setName] = useState<string>('');

  const { searching, setSearching } = useContext(searchingContext);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`This is the current name ${name}`);
      setName(e.target.value);
    },
    [name]
  );

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (name.length > 0) {
        searchButtonHandler(name, setSearching);
      }
    },
    [name, setSearching]
  );

  // useEffect(() => {
  //   console.log(`Component Mounted: ${performance.now()}`);

  //   return () => {
  //     console.log(`Component Unmounted: ${performance.now()}`);
  //   };
  // }, []);

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
              onChange={handleOnChange}
            />
            <button
              type="submit"
              disabled={!name}
              onClick={handleSubmit}
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
