import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const port = process.env.PORT || 5000;
const mongodb_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/DMPTest';

mongoose.connect(mongodb_uri);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Success!!');
});

export default {
    port,
    mongodb_uri,
};
