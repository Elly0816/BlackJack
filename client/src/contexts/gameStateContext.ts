import { createContext } from 'react';
import { GameScoreType } from '../socket/listeners/Listeners';

export const GameStateContext = createContext<GameScoreType | undefined>(
  undefined
);
