import { createContext } from "react";
import { connectedSocket } from "../socket/Socket";


export const socketContext = createContext(connectedSocket);