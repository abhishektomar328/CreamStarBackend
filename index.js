import app from './app.js';
import cloudinary from 'cloudinary';
import { connectToDb } from './config/dbConfig.js';

// Define the port
const PORT = process.env.PORT || 3000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Start the server
app.listen(PORT,async () => {
  await connectToDb();
  console.log(`Server is running on port ${PORT}`);
});