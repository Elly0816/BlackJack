import { createContext } from 'react';
import { GameFromServerType } from '../types/gameType/gameFromServerType';

export type gameContextAndTurn = GameFromServerType & {
  isTurn: boolean;
  setGame: React.Dispatch<React.SetStateAction<GameFromServerType | undefined>>;
};

export const gameContext = createContext<gameContextAndTurn | null>(null);
