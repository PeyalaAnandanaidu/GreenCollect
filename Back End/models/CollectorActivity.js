const mongoose = require('mongoose');

const collectorActivitySchema = new mongoose.Schema({
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteRequest',
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'in-progress', 'completed', 'cancelled'],
    required: true
  },
  activityDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
collectorActivitySchema.index({ collectorId: 1 });
collectorActivitySchema.index({ wasteRequestId: 1 });
collectorActivitySchema.index({ activityDate: -1 });

module.exports = mongoose.model('CollectorActivity', collectorActivitySchema);