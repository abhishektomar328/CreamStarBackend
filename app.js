import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
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
app.use(morgan('dev'));

app.use('/ping', (req, res) => {
    res.send('Pong');
  });

app.use('/api/auth',userRoute);
app.use('/api/image',imageRoute);

app.all('*', (req, res) => { 
    res.status(404).send('OOPS 404 page not found');
});

export default app;


// Note - difference between app.use() and app.get()

// app.use() is for applying middleware to all routes or a specific path, handling all HTTP methods. It is especially useful for tasks like logging, body parsing, or global authentication checks.
// app.get() is used when you want to handle only GET requests for a specific route.
// Which is better? It depends on your use case:
// If you're building a route handler for a GET request, use app.get().
// If you need middleware (e.g., logging, authentication) that applies to multiple or all routes, or if you want to handle all HTTP methods, use app.use()