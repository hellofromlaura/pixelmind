import express from 'express';
import { routes } from './routes.js'
import cors from 'cors';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
}

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})