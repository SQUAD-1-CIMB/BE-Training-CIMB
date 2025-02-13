import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config.js';

const { cloudinary } = config;
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'training_thumbnails',
        allowed_formats: ['jpg', 'png'],
    },
});

const upload = multer({ storage: storage });

export default upload;