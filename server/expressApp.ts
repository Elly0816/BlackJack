import express from 'express';
import cors from 'cors';


export function initializeServer(){
    const app = express();
    app.use(cors())
    


    

    return app;
}

