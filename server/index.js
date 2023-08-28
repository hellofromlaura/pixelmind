import express from 'express';
import { routes } from './routes.js'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/build')))
// }

if (process.env.NODE_ENV === "production") {
    app.use(express.static("../client/build"));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
}

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})