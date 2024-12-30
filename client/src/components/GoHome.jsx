export default function GoHome(props) {
  return (
    <button onClick={props.goHome} className="game-button">
      <span>Go Home</span>
    </button>
  );
}
