import Router from 'express'
import {logout, signin, signup } from '../controllers/userController.js';
import upload from '../middlewares/multerMiddleware.js';
import { addImage, getAllCategoriesWithImages } from '../controllers/imageController.js';

export const imageRoute = Router();

imageRoute.post('/upload',upload.array('images', 10),addImage);
imageRoute.get('/images',getAllCategoriesWithImages);



