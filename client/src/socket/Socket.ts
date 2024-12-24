import {io, Socket} from 'socket.io-client';
import { Endpoint } from '../constants/Constants';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';



export const connectedSocket:Socket<DefaultEventsMap, DefaultEventsMap> = io(Endpoint.development);
