import express from 'express';
import morgan from 'morgan';
import routes from './route.js';
import config from './config.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(morgan('combined'));

app.use('/public', express.static(path.join(__dirname, 'files')));

app.use('/', routes);

app.listen(config.port, () => {
  	console.log(`App is running in port ${config.port}`);
});
