const mongoose = require('mongoose');

const collectorInfoSchema = new mongoose.Schema({
  phone: String,
  address: String,
  vehicleType: String,
  vehicleNumberPlate: String,
  experience: String,
  isApproved: { type: Boolean, default: false }, // ✅ approval flag
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' } // optional
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'collector', 'admin'], default: 'user' },
  collectorInfo: collectorInfoSchema
});

module.exports = mongoose.model('User', userSchema);
