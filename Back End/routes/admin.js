// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users');

// Get all collector requests
router.get('/collector-requests', async (req, res) => {
  try {
    console.log('Fetching collector requests...');
    
    const collectors = await User.find({ 
      role: 'collector'
    }).select('name email role collectorInfo createdAt').lean();
    
    console.log(`Found ${collectors.length} collectors`);
    
    // Transform the data for frontend
    const transformedData = collectors.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      collectorInfo: {
        phone: user.collectorInfo?.phone || 'N/A',
        address: user.collectorInfo?.address || 'N/A',
        vehicleType: user.collectorInfo?.vehicleType || 'N/A',
        vehicleNumberPlate: user.collectorInfo?.vehicleNumberPlate || 'N/A',
        experience: user.collectorInfo?.experience || 'No experience provided',
        isApproved: user.collectorInfo?.isApproved || false,
        status: user.collectorInfo?.isApproved ? 'approved' : 'pending'
      }
    }));
    
    res.json(transformedData);
  } catch (err) {
    console.error('Error fetching collector requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve collector request
router.post('/approve-collector/:id', async (req, res) => {
  try {
    const collector = await User.findById(req.params.id);
    if (!collector) {
      return res.status(404).json({ error: 'Collector not found' });
    }

    if (!collector.collectorInfo) {
      return res.status(400).json({ error: 'Collector info not found' });
    }

    collector.collectorInfo.isApproved = true;
    collector.collectorInfo.status = 'approved';
    
    await collector.save();

    res.json({ 
      message: 'Collector approved successfully', 
      collector: {
        id: collector._id,
        name: collector.name,
        email: collector.email,
        status: 'approved'
      }
    });
  } catch (err) {
    console.error('Error approving collector:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject collector request
router.post('/reject-collector/:id', async (req, res) => {
  try {
    const collector = await User.findById(req.params.id);
    if (!collector) {
      return res.status(404).json({ error: 'Collector not found' });
    }

    if (!collector.collectorInfo) {
      return res.status(400).json({ error: 'Collector info not found' });
    }

    collector.collectorInfo.isApproved = false;
    collector.collectorInfo.status = 'rejected';
    
    await collector.save();

    res.json({ 
      message: 'Collector rejected successfully',
      collector: {
        id: collector._id,
        name: collector.name,
        email: collector.email,
        status: 'rejected'
      }
    });
  } catch (err) {
    console.error('Error rejecting collector:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;