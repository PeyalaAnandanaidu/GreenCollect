// models/WasteRequest.js
const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  pickupTime: {
    type: String, // You can also use Date if you want exact timestamp
    required: true,
  },
  wasteType: {
    type: String,
    required: true,
    trim: true,
  },
  estimatedWeight: {
    type: Number, // in kg
    required: true,
    min: [0, 'Weight cannot be negative'],
  },
  pickupAddress: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    trim: true,
  },
  collectorStatus: {
    // Tracks if any collector has accepted the request
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  collectionStatus: {
    // Tracks waste collection process
    type: String,
    enum: ['not_collected', 'in_progress', 'completed', 'cancelled'],
    default: 'not_collected',
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming collector is a User with role 'collector'
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);
