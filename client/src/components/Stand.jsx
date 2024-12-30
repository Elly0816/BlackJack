export default function Stand(props) {
  return (
    <button onClick={props.stand} className="game-button stand">
      <span>Stand</span>
    </button>
  );
}
