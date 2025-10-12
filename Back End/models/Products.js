// Import the Mongoose library, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.
const mongoose = require('mongoose');

// Define the schema for the Product collection.
// A schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required.'], // This field must be a string and is mandatory.
        trim: true // Automatically removes whitespace from the start and end of the value.
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price cannot be negative.'] // The price must be a non-negative number.
    },
    coinsRequired: {
        type: Number,
        required: [true, 'Coins required are required.'],
        default: 0, // Sets a default value of 0 if no value is provided.
        min: [0, 'Coins required cannot be negative.']
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Stock quantity is required.'],
        min: [0, 'Stock quantity cannot be negative.']
    },
    isActive: {
        type: Boolean,
        default: true // New products will be active by default.
    },
    productImage: {
        type: String,
        // required: [true, 'Product image URL is required.'],
        default: 'https://img10.hotstar.com/image/upload/f_auto,h_156/sources/r1/cms/prod/1661/1371661-t-a4a551a85a80'
    }
}, {
    // Options for the schema
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields to the documents.
});

// Create a Mongoose model from the schema.
// The model is a constructor compiled from the schema definition. An instance of a model is a document.
const Product = mongoose.model('Product', productSchema);

// Export the model so it can be used in other parts of the application.
module.exports = Product;