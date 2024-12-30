import { createContext } from "react";
import { GameFromServerType } from "../types/gameType/gameFromServerType";

export const gameContext = createContext<GameFromServerType | null>(null);
