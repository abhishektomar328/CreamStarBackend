
import Router from 'express'
import {logout, signin, signup } from '../controllers/userController.js';

export const userRoute = Router();

userRoute.post('/signup', signup);
userRoute.post('/signin', signin);
userRoute.post('/logout', logout);


