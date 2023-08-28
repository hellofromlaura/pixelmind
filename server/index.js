import express from 'express';
import { routes } from './routes.js'
import cors from 'cors';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})