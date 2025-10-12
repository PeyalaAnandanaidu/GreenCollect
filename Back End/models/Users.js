// models/User.js
const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema({
  phone: { type: String },
  address: { type: String },
  vehicleType: { type: String },
  vehicleNumberPlate: { type: String },
  experience: { type: String },
  isApproved: { type: Boolean, default: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['user', 'collector', 'admin'],
    default: 'user'
  },
  // these fields will be present for collectors
  collectorInfo: { type: collectorSchema, default: null },
  coins: { type: Number, default: 0 },
  wasteRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteRequest',  // This should match your WasteRequest model name
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
