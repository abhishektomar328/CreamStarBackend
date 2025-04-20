
import cloudinary from 'cloudinary'
import fs from 'fs'
import ImageCategory from '../models/categoryModel.js';

export const addImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      console.log('Uploading file:', file.path);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'event_images',
        resource_type: 'auto',
      });

      if (!result || !result.secure_url || !result.public_id) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      // Delete the file after upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      } else {
        console.error('File not found:', file.path);
      }

      uploadedImages.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }

    const { categoryName } = req.body;
    console.log('Category Name:', categoryName);

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

    let categoryDoc = await ImageCategory.findOne({ name: categoryName });

    if (!categoryDoc) {
      categoryDoc = new ImageCategory({ name: categoryName, images: [] });
    }

    categoryDoc.images.push(...uploadedImages);
    await categoryDoc.save();

    res.status(200).json({
      message: 'Images uploaded successfully',
      categoryDoc,
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }

    console.error(error); // Log the full error for debugging
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};

export const getAllCategoriesWithImages = async (req, res) => {
  try {
    const categories = await ImageCategory.find().select('name images');

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json({
      message: 'Categories retrieved successfully',
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { categoryId, imagePublicId } = req.body;
    console.log(req.body);

    // Find the category document
    const categoryDoc = await ImageCategory.findById(categoryId);

    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the image in the category
    const imageIndex = categoryDoc.images.findIndex(
      (image) => image.public_id === imagePublicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found in this category' });
    }

    // Delete the image from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(imagePublicId);

    if (cloudinaryResponse.result !== 'ok') {
      return res.status(500).json({ message: 'Error deleting image from Cloudinary' });
    }

    // Remove the image from the category's images array
    categoryDoc.images.splice(imageIndex, 1);

    // Save the updated category
    await categoryDoc.save();

    res.status(200).json({
      message: 'Image deleted successfully',
      categoryDoc,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};

