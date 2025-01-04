import React, { ReactElement, useContext } from 'react';
import './hitAndStandButtons.css';
import Emitter from '../../socket/emitters/Emitters';
import { gameContext, gameContextAndTurn } from '../../contexts/gameContext';

export default function HitAndStandButtons(): ReactElement {
  const emitter = Emitter.getInstance();

  const { id } = useContext(gameContext) as gameContextAndTurn;

  return (
    <div className="flex flex-row justify-evenly items-center w-full">
      <button
        type="button"
        className="text-slate-300 bg-green-800 min-w-fit p-5 w-28 rounded-2xl hover:shadow-2xl hover:shadow-slate-800"
        onClick={() => {
          emitter.hit(id);
        }}
      >
        Hit
      </button>
      <button
        type="button"
        onClick={() => {
          emitter.stand(id);
        }}
        className="text-slate-300 bg-red-800 min-w-fit p-5 w-28 rounded-2xl hover:shadow-2xl hover:shadow-slate-800"
      >
        Stand
      </button>
    </div>
  );
}
