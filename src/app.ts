import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import routes from './routes';


const app = express(); // Inicializar express (mòdulo de node para restful)
app.use(helmet()); // BodyParser 
app.use(bodyParser.json());// body en json para post, put y patch
app.use(bodyParser.urlencoded({extended: true})); //
app.use(cors()); //
app.use(express.json()); //parsear los response a formato json


routes(app);

export default app;

