import express, { Express } from 'express';
import cors from 'cors';
import router from './routes';

const app: Express = express();
const port = process.env.port|| 3000;


app.use(cors());
app.use(express.json());

app.use('/api/v1', router);


app.listen(port);