export default function Hit(props) {
  return (
    <button onClick={props.hit} className="game-button hit">
      <span>Hit</span>
    </button>
  );
}
