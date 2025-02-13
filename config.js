import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        logging: false,
    }
);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default {
    sequelize,
    port: process.env.PORT || 5000,
    cloudinary
};
