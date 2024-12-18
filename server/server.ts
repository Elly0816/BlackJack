import {initializeServer} from './expressApp'
import { initializeSocket } from './socketServer';
import { Server } from 'http';
import homeRoutes from './routes/homeRoute';

const PORT = 5000;

const app = initializeServer();

const httpServer = new Server(app);

initializeSocket(httpServer);


app.use(homeRoutes);


httpServer.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});