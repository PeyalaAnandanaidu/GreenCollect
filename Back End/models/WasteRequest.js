const mongoose = require('mongoose');

const wasteRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  wasteType: {
    type: String,
    required: true,
    enum: ['plastic', 'paper', 'electronics', 'metal', 'glass', 'organic', 'mixed']
  },
  estimatedWeight: {
    type: Number,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    default: 'Not provided'
  },
  contactEmail: {
    type: String
  },
  // Organisation-specific fields (optional)
  isOrganisationRequest: {
    type: Boolean,
    default: false
  },
  organisationName: {
    type: String
  },
  organisationType: {
    type: String,
    enum: ['school', 'company', 'ngo', 'other']
  },
  organisationContactName: {
    type: String
  },
  organisationContactPhone: {
    type: String
  },
  wasteTypes: [{ type: String }],
  instructions: {
    type: String,
    default: 'None'
  },
  collectorStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  collectionStatus: {
    type: String,
    enum: ['not_collected', 'in_progress', 'collected'],
    default: 'not_collected'
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  collectedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
wasteRequestSchema.index({ user: 1 });
wasteRequestSchema.index({ assignedCollector: 1 });
wasteRequestSchema.index({ collectorStatus: 1 });
wasteRequestSchema.index({ pickupDate: 1 });

module.exports = mongoose.model('WasteRequest', wasteRequestSchema);