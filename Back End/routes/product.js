const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Products.js');

const router = express.Router();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * POST /products
 * Creates a new product with an image upload.
 * The request must be multipart/form-data.
 */
router.post('/', upload.single('productImage'), async (req, res) => {
  try {
    let uploadResult = null;

    // ✅ Upload to Cloudinary only if image is provided
    if (req.file) {
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    }

    // ✅ Create new product
    const newProduct = new Product({
      productName: req.body.productName,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      coinsRequired: req.body.coinsRequired,
      stockQuantity: req.body.stockQuantity,
      productImage: uploadResult ? uploadResult.secure_url : null,
      cloudinaryId: uploadResult ? uploadResult.public_id : null
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully!',
      product: savedProduct
    });

  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      message: 'An error occurred while creating the product.',
      error: error.message
    });
  }
});
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // { new: true } returns the updated document
        // runValidators ensures the updated data respects the schema rules
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all documents in Product collection
        res.status(200).json({
            message: 'Products fetched successfully',
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================================
// 🔴 2. DELETE — Delete product by ID
// ==================================
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            deletedProduct
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.patch('/status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        // Validate input
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: '`isActive` must be a boolean value (true or false).' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { isActive },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: isActive ? 'Product activated successfully' : 'Product deactivated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
