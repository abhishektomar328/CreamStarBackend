import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import {userRoute} from './routes/userRoute.js'
import { imageRoute } from './routes/imageRoute.js';
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}));

app.use('/ping', (req, res) => {
    res.send('Pong');
  });

app.use('/api/auth',userRoute);
app.use('/api/image',imageRoute);

// app.all('*', (req, res) => { 
//     res.status(404).send('OOPS 404 page not found');
// });

export default app;


