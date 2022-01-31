const cloudinary = require('cloudinary').v2;
import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary
});


export const upload = multer({ storage: cloudinaryStorage });
