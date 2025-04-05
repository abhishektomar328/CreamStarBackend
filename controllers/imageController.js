
import cloudinary from 'cloudinary'
import fs from 'fs'
import ImageCategory from '../models/categoryModel.js';

// Controller to add images
export const addImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = [];

    // Loop through the uploaded files
    for (const file of req.files) {
      // Upload each image to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'event_images',  // Store images in the 'event_images' folder in Cloudinary
        resource_type: 'auto',  // Automatically detect file type (image, video, etc.)
      });

      // Delete the file from local storage after uploading to Cloudinary
      fs.unlinkSync(file.path);

      // Store the Cloudinary details (public_id, secure_url) for each image
      uploadedImages.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }

    // Extract category name from the request body
    const { categoryName } = req.body;
    console.log(categoryName)

    // Validate category name
    const validCategories = [
      'Orchestra & Musical Nights',
      'Jagran and Mata Ki Chowki',
      'Light and Sound System',
      'Varmala Themes',
      'Dance Troupes',
      'Flower Decoration',
      'Wedding Planning & Corporate Events',
      'School & Birthday Parties',
    ];

    if (!validCategories.includes(categoryName)) {
      return res.status(400).json({ message: 'Invalid category name' });
    }

    // Find or create the category document
    let categoryDoc = await ImageCategory.findOne({ name: categoryName });

    if (!categoryDoc) {
      categoryDoc = new ImageCategory({ name: categoryName, images: [] });
    }

    // Add the uploaded images to the category
    categoryDoc.images.push(...uploadedImages);

    // Save the updated category document
    await categoryDoc.save();

    // Return the success response
    res.status(200).json({
      message: 'Images uploaded successfully',
      categoryDoc,
    });
  } catch (error) {
    // Delete any files from local storage in case of an error
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }

    console.error(error);
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};

export const getAllCategoriesWithImages = async (req, res) => {
  try {
    // Retrieve all categories and their associated images
    const categories = await ImageCategory.find().select('name images');

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    // Return the categories with their images
    res.status(200).json({
      message: 'Categories retrieved successfully',
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};
