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

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')))
}

// app.use('/', routes);

app.get('/', (req, res) => {
    const indexPagePath = path.join(__dirname, '../client/build/index.html');
    fs.access(indexPagePath, (err) => {
      if (err) {
        log(LogLevel.warn, `Can't find file ' ${indexPagePath}`);
        res.status(404).send(`Can't find file ${indexPagePath}`);
      } else {
        res.sendFile(indexPagePath);
      }
    });
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})