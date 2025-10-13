const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  establishingYear: { type: Number, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  wasteProcessed: { type: String, required: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
