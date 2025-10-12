const express = require('express');
const router = express.Router();
const WasteRequest = require('../models/WasteRequest');
const User = require('../models/User'); // Optional: if you want to validate userId
const CollectorActivity = require('../models/CollectorActivity'); // <-- Import activity model

// @route   POST /api/waste-requests
// @desc    Create a new waste request
// @access  Private (assumes user is logged in)
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // 1. Find the user and populate the wasteRequests field
      const user = await User.findById(id)
        .populate({
          path: 'wasteRequests',          // 👈 must match the field in your User model
          model: 'WasteRequest',          // 👈 name of the WasteRequest model
          populate: {
            path: 'assignedCollector',    // 👈 optional: if WasteRequest has collector reference
            model: 'User',               // if collector is also a User
            select: 'name email role collectorInfo'
          }
        })
        .select('-password');  // 👈 exclude sensitive fields like password
  
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
      // 2. Send the populated user data to the frontend
      res.status(200).json({
        success: true,
        message: 'User data fetched successfully',
        user
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
router.post('/', async (req, res) => {
    try {
      const {
        userId,
        pickupDate,
        pickupTime,
        wasteType,
        estimatedWeight,
        pickupAddress,
        contactNumber,
        instructions
      } = req.body;
  
      // 1. Validate that the user exists
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
      // 2. Create new WasteRequest object
      const newRequest = new WasteRequest({
        user: userId,  // 👈 Make sure field name matches your WasteRequest model
        pickupDate,
        pickupTime,
        wasteType,
        estimatedWeight,
        pickupAddress,
        contactNumber,
        instructions,
        collectorStatus: 'pending',
        collectionStatus: 'not_collected'
      });
  
      // 3. Save to database
      const savedRequest = await newRequest.save();
  
      // 4. Push the waste request ID to the user's `wasteRequests` array
      user.wasteRequests.push(savedRequest._id);
      await user.save();
  
      // 5. Send response
      res.status(201).json({
        success: true,
        message: 'Waste request created and linked to user successfully',
        request: savedRequest
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
  
// Get all pending requests (collector sees these)
router.get('/pending', async (req, res) => {
    try {
      const pendingRequests = await WasteRequest.find({ collectorStatus: 'pending' })
        .populate('userId', 'name email contactNumber'); // optional: get user info
  
      res.status(200).json({
        success: true,
        requests: pendingRequests
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });

// @route   PUT /api/waste-requests/accept/:wasteId
// @desc    Collector accepts a waste request & logs the activity
// @access  Private (collector)
router.put('/accept/:wasteId', async (req, res) => {
  try {
    const { collectorId } = req.body; // Collector ID from request body
    const { wasteId } = req.params;   // Waste request ID from URL

    if (!collectorId) {
      return res.status(400).json({ success: false, message: 'Collector ID is required' });
    }

    // Find the waste request by ID
    const request = await WasteRequest.findById(wasteId);
    if (!request) return res.status(404).json({ success: false, message: 'Waste request not found' });

    // Check if request is already accepted or rejected
    if (request.collectorStatus !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Request already ${request.collectorStatus}` 
      });
    }

    // Update the waste request status
    request.collectorStatus = 'accepted';
    request.assignedCollector = collectorId;
    request.collectionStatus = 'in_progress';
    const updatedRequest = await request.save();

    // Log the activity in CollectorActivity collection
    await CollectorActivity.create({
      collectorId,
      wasteRequestId: wasteId,
      status: 'accepted'
    });

    res.status(200).json({
      success: true,
      message: 'Waste request accepted successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});
router.get('/stats/:collectorId', async (req, res) => {
  try {
    const { collectorId } = req.params;

    if (!collectorId) {
      return res.status(400).json({ success: false, message: 'Collector ID is required' });
    }

    // Count total accepted but not collected
    const pendingCount = await CollectorActivity.countDocuments({
      collectorId,
      status: 'accepted'
    });

    // Count total collected
    const collectedCount = await CollectorActivity.countDocuments({
      collectorId,
      status: 'collected'
    });

    res.status(200).json({
      success: true,
      collectorId,
      stats: {
        pending: pendingCount,
        collected: collectedCount
      }
    });

  } catch (error) {
    console.error('Error getting collector stats:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});
module.exports = router;
