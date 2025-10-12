const mongoose = require('mongoose');

const collectorActivitySchema = new mongoose.Schema({
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wasteRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'WasteRequest', required: true },
  status: { type: String, enum: ['accepted', 'collected'], default: 'accepted' },
  acceptedAt: { type: Date, default: Date.now },
  collectedAt: { type: Date }
});

module.exports = mongoose.model('CollectorActivity', collectorActivitySchema);
