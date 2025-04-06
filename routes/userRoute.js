
import express from 'express'
import {logout, signin, signup } from '../controllers/userController.js';

export const userRoute = express.Router();

userRoute.post('/signup', signup);
userRoute.post('/signin', signin);
userRoute.post('/logout', logout);


