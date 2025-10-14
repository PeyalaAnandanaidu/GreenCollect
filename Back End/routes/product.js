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
// POST /products
router.post('/', upload.single('productImage'), async (req, res) => {
  console.log('Create Product Request Body:', req.body);
  try {
    let uploadResult = null;

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

    const newProduct = new Product({
      productName: req.body.productName,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      coinsRequired: req.body.coinsRequired,
      stockQuantity: req.body.stockQuantity,
      productImage: uploadResult ? uploadResult.secure_url : null, // ✅ save image URL
      cloudinaryId: uploadResult ? uploadResult.public_id : null,   // ✅ save Cloudinary ID for future delete
      isActive: true
    });
    console.log('New Product to be saved:', newProduct);
    // In your backend create-product API, before saving
    delete req.body.slug; // remove any slug field if it exists

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

router.put('/update/:id', upload.single('productImage'), async (req, res) => {
  console.log('Update Product Request Body:', req.body);
  try {
    const { id } = req.params;

    // Upload image to Cloudinary if a new file is provided
    let uploadResult = null;
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

    // Build update object
    const updateData = {
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      coinsRequired: req.body.coinsRequired,
      category: req.body.category,
      stockQuantity: req.body.stockQuantity,
    };

    // Add image fields only if a new image is uploaded
    if (uploadResult) {
      updateData.productImage = uploadResult.secure_url;
      updateData.cloudinaryId = uploadResult.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  console.log('Fetching all products from the database...');
    try {
        const products = await Product.find(); // Fetch all documents in Product collection
        console.log('GET /products called');
        console.log('Fetched Products:', products);
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
