import express from 'express';
import morgan from 'morgan';
import routes from './route.js';
import cookieParser from 'cookie-parser';
import config from './config.js';

const { sequelize } = config; // ✅ Ambil sequelize dari config
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.use('/', routes);

sequelize.authenticate() // ✅ Gunakan sequelize.authenticate(), bukan config.authenticate()
    .then(() => {
        console.log("Database connection established successfully.");
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

app.listen(config.port, () => {
    console.log(`App is running on port ${config.port}`);
});
