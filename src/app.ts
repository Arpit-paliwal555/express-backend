import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';

const app: Express = express();


app.use(cors());
app.use(express.json());

app.use('/api/v1', router);


export default app;