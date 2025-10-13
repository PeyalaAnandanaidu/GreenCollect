const mongoose = require('mongoose');

const collectorInfoSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: function() {
      // Only require if parent user is a collector
      return this.parent().role === 'collector';
    },
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  address: { 
    type: String, 
    required: function() {
      return this.parent().role === 'collector';
    },
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  vehicleType: { 
    type: String, 
    required: function() {
      return this.parent().role === 'collector';
    },
    enum: ['Three-wheeler', 'Pickup Truck', 'Mini Truck', 'Truck', 'Car', 'Van', 'Motorcycle', 'Bicycle', 'Other']
  },
  vehicleNumberPlate: { 
    type: String, 
    required: function() {
      return this.parent().role === 'collector';
    },
    uppercase: true,
    trim: true
  },
  experience: { 
    type: String, 
    required: function() {
      return this.parent().role === 'collector';
    },
    maxlength: [500, 'Experience description too long']
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rejectionReason: {
    type: String,
    maxlength: [200, 'Rejection reason too long']
  }
});

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  role: { 
    type: String, 
    enum: ['user', 'collector', 'admin'], 
    default: 'user' 
  },
  points: { 
    type: Number, 
    default: 250,
    min: [0, 'Points cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  wasteRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteRequest',
    default: []
  }],
  collectorInfo: {
    type: collectorInfoSchema,
    required: false // Make it optional for all users
  }
}, { 
  timestamps: true
});

// Virtual for checking if user is a collector
userSchema.virtual('isCollector').get(function() {
  return this.role === 'collector';
});

// Virtual for checking if collector is approved
userSchema.virtual('isApprovedCollector').get(function() {
  return this.role === 'collector' && 
         this.collectorInfo && 
         this.collectorInfo.isApproved;
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'collectorInfo.status': 1 });

// Pre-save middleware to sync isApproved with status
userSchema.pre('save', function(next) {
  if (this.collectorInfo) {
    if (this.collectorInfo.status === 'approved') {
      this.collectorInfo.isApproved = true;
    } else if (['pending', 'rejected'].includes(this.collectorInfo.status)) {
      this.collectorInfo.isApproved = false;
    }
    
    if (this.collectorInfo.status !== 'rejected') {
      this.collectorInfo.rejectionReason = undefined;
    }
  }
  
  if (!this.wasteRequests) {
    this.wasteRequests = [];
  }
  
  next();
});

module.exports = mongoose.model('User', userSchema);