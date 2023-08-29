import express from 'express';
import { routes } from './server/routes.js'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'client/build')))

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})