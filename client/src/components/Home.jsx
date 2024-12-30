import { useState } from "react";

export default function Home(props) {
  const [name, setName] = useState("");

  return (
    <div className="home">
      {!props.searching ? (
        <div className="home-item">
          <h2>WELCOME TO BLACKJACK</h2>
          <form>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                console.log(`This is the current name ${name}`);
                setName(e.target.value);
              }}
            />
            <button
              onClick={() => {
                props.socketSearch(name);
              }}
              className="search-button"
            >
              Search for a game and join
            </button>
          </form>
        </div>
      ) : (
        <div className="main">
          <span>
            Searching
            <img src={process.env.PUBLIC_URL + "back.png"} alt="circle" />
          </span>
        </div>
      )}
    </div>
  );
}
