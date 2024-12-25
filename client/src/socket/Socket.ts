import {io, Socket} from 'socket.io-client';
import { CONSTANTS } from '../constants/Constants';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';



export const connectedSocket:Socket<DefaultEventsMap, DefaultEventsMap> = io(CONSTANTS.developmentEndpoint);
