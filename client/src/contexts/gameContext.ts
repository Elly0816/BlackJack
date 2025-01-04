import { createContext } from 'react';
import { GameFromServerType } from '../types/gameType/gameFromServerType';

export type gameContextAndTurn = GameFromServerType & { isTurn: boolean };

export const gameContext = createContext<gameContextAndTurn | null>(null);
