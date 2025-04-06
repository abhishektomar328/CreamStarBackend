import express from 'express'
import upload from '../middlewares/multerMiddleware.js';
import { addImage, getAllCategoriesWithImages } from '../controllers/imageController.js';

export const imageRoute = express.Router();

imageRoute.post('/upload',upload.array('images', 10),addImage);
imageRoute.get('/images',getAllCategoriesWithImages);



