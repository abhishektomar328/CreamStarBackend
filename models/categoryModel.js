import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'Orchestra & Musical Nights',
      'Jagran and Mata Ki Chowki',
      'Light and Sound System',
      'Varmala Themes',
      'Dance Troupes',
      'Flower Decoration',
      'Wedding Planning & Corporate Events',
      'School & Birthday Parties',
    ],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
});

const ImageCategory = mongoose.model('ImageCategory', imageSchema);
export default ImageCategory;
