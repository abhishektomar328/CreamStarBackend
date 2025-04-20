import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import {userRoute} from './routes/userRoute.js'
import { imageRoute } from './routes/imageRoute.js';
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:4200';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
// app.use(cors({
//   origin: [process.env.FRONTEND_URL || 'http://localhost:4200' ],
//   credentials: true
// }));

// const corsOptions = {
//   origin: 'http://localhost:4200', // Allow requests from this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//   credentials: true, // Allow cookies and credentials
// };

// app.use(cors(corsOptions));

app.use('/ping', (req, res) => {
    res.send('Pong');
  });

app.use('/api/auth',userRoute);
app.use('/api/image',imageRoute);

// app.all('*', (req, res) => { 
//     res.status(404).send('OOPS 404 page not found');
// });

export default app;


