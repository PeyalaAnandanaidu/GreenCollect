const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const WasteRequest = require('../models/WasteRequest');
const User = require('../models/Users');
const CollectorActivity = require('../models/CollectorActivity');

// Helper function to calculate coins value
function calculateCoinsValue(weight, wasteType) {
  const baseValue = weight * 10;
  let multiplier = 1;
  
  switch (wasteType.toLowerCase()) {
    case 'electronics':
      multiplier = 1.5;
      break;
    case 'metal':
      multiplier = 1.3;
      break;
    case 'plastic':
      multiplier = 1.2;
      break;
    case 'paper':
      multiplier = 1.1;
      break;
    default:
      multiplier = 1;
  }
  
  return Math.round(baseValue * multiplier);
}

// @route   GET /api/waste-requests
// @desc    Get waste requests with filters (for collectors)
// @access  Private (Collectors only)
router.get('/', authMiddleware, requireRole(['collector', 'admin']), async (req, res) => {
  try {
    const { status } = req.query;
    const collectorId = req.user.id;
    
    let query = {};
    
    // Build query based on parameters
    if (status && status !== 'all') {
      query.collectorStatus = status;
    } else {
      // For collectors, show pending requests and their accepted requests
      query.$or = [
        { collectorStatus: 'pending' },
        { assignedCollector: collectorId }
      ];
    }

    const requests = await WasteRequest.find(query)
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
      _id: request._id,
      userId: {
        _id: request.user._id,
        name: request.user.name,
        email: request.user.email,
        phone: request.user.phone || 'Not provided'
      },
      pickupAddress: request.pickupAddress,
      wasteType: request.wasteType,
      estimatedWeight: request.estimatedWeight,
      pickupDate: request.pickupDate.toISOString().split('T')[0],
      pickupTime: request.pickupTime,
      status: request.collectorStatus,
      priority: request.priority || 'medium',
      instructions: request.instructions,
      coinsValue: calculateCoinsValue(request.estimatedWeight, request.wasteType),
      createdAt: request.createdAt,
      collectorId: request.assignedCollector?._id
    }));

    res.status(200).json(formattedRequests);

  } catch (error) {
    console.error('Error fetching waste requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching requests' 
    });
  }
});

// @route   GET /api/waste-requests/my-requests
// @desc    Get current user's waste requests
// @access  Private
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('🔧 Fetching requests for user:', userId);

    const userRequests = await WasteRequest.find({ user: userId })
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${userRequests.length} requests for user ${userId}`);

    // Format the response to match frontend expectations
    const formattedRequests = userRequests.map(request => ({
      _id: request._id,
      userId: {
        _id: request.user._id,
        name: request.user.name,
        email: request.user.email,
        phone: request.user.phone || 'Not provided'
      },
      pickupAddress: request.pickupAddress,
      wasteType: request.wasteType,
      estimatedWeight: request.estimatedWeight,
      pickupDate: request.pickupDate.toISOString().split('T')[0],
      pickupTime: request.pickupTime,
      status: request.collectorStatus,
      priority: request.priority || 'medium',
      instructions: request.instructions,
      coinsValue: calculateCoinsValue(request.estimatedWeight, request.wasteType),
      createdAt: request.createdAt,
      collectorId: request.assignedCollector?._id,
      assignedCollector: request.assignedCollector ? {
        _id: request.assignedCollector._id,
        name: request.assignedCollector.name,
        email: request.assignedCollector.email
      } : undefined
    }));

    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      requests: formattedRequests
    });

  } catch (error) {
    console.error('❌ Error fetching user requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching requests',
      error: error.message 
    });
  }
});

// @route   POST /api/waste-requests
// @desc    Create a new waste pickup request
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      pickupDate,
      pickupTime,
      wasteType,
      estimatedWeight,
      pickupAddress,
      contactNumber,
      instructions
    } = req.body;

    const userId = req.user.id;

    // Validation
    if (!pickupDate || !pickupTime || !wasteType || !estimatedWeight || !pickupAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled' 
      });
    }

    // Validate weight is a positive number
    const weight = parseFloat(estimatedWeight);
    if (isNaN(weight) || weight <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estimated weight must be a positive number' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const newRequest = new WasteRequest({
      user: userId,
      pickupDate: new Date(pickupDate),
      pickupTime,
      wasteType,
      estimatedWeight: weight,
      pickupAddress,
      contactNumber: contactNumber || 'Not provided',
      instructions: instructions || 'None',
      collectorStatus: 'pending',
      collectionStatus: 'not_collected'
    });

    const savedRequest = await newRequest.save();

    // Add to user's wasteRequests array
    if (!user.wasteRequests) {
      user.wasteRequests = [];
    }
    user.wasteRequests.push(savedRequest._id);
    await user.save();

    await savedRequest.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Waste pickup scheduled successfully!',
      request: {
        id: savedRequest._id,
        pickupDate: savedRequest.pickupDate,
        pickupTime: savedRequest.pickupTime,
        wasteType: savedRequest.wasteType,
        estimatedWeight: savedRequest.estimatedWeight,
        pickupAddress: savedRequest.pickupAddress,
        contactNumber: savedRequest.contactNumber,
        instructions: savedRequest.instructions,
        status: savedRequest.collectorStatus,
        userName: savedRequest.user.name,
        userEmail: savedRequest.user.email,
        coinsValue: calculateCoinsValue(savedRequest.estimatedWeight, savedRequest.wasteType)
      }
    });

  } catch (error) {
    console.error('Error creating waste request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while scheduling pickup',
      error: error.message 
    });
  }
});

// @route   PUT /api/waste-requests/:requestId/accept
// @desc    Collector accepts a waste request
// @access  Private (Collectors only)
router.put('/:requestId/accept', authMiddleware, requireRole(['collector']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const collectorId = req.user.id;

    console.log('🔧 Accepting request debug:');
    console.log('Request ID:', requestId);
    console.log('Collector ID:', collectorId);

    const request = await WasteRequest.findById(requestId);

    if (!request) {
      console.log('❌ Request not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Waste request not found' 
      });
    }

    console.log('📋 Request details before accept:', {
      id: request._id,
      collectorStatus: request.collectorStatus,
      assignedCollector: request.assignedCollector
    });

    if (request.collectorStatus !== 'pending') {
      console.log('❌ Invalid status for acceptance');
      return res.status(400).json({ 
        success: false, 
        message: `Request already ${request.collectorStatus}` 
      });
    }

    // Update request status
    request.collectorStatus = 'accepted';
    request.assignedCollector = collectorId;
    request.collectionStatus = 'not_collected';
    
    const updatedRequest = await request.save();
    
    // Populate after saving
    await updatedRequest.populate('user', 'name email phone');
    await updatedRequest.populate('assignedCollector', 'name email');

    console.log('✅ Request accepted successfully');
    console.log('📋 Request details after accept:', {
      id: updatedRequest._id,
      collectorStatus: updatedRequest.collectorStatus,
      assignedCollector: updatedRequest.assignedCollector,
      assignedCollectorId: updatedRequest.assignedCollector?._id?.toString()
    });

    // Log collector activity
    await CollectorActivity.create({
      collectorId,
      wasteRequestId: requestId,
      status: 'accepted'
    });

    res.status(200).json({
      success: true,
      message: 'Waste request accepted successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('❌ Error accepting request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while accepting request',
      error: error.message 
    });
  }
});

// @route   PUT /api/waste-requests/:requestId/reject
// @desc    Collector rejects a waste request
// @access  Private (Collectors only)
router.put('/:requestId/reject', authMiddleware, requireRole(['collector']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const collectorId = req.user.id;

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Waste request not found' 
      });
    }

    if (request.collectorStatus !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Request already ${request.collectorStatus}` 
      });
    }

    request.collectorStatus = 'rejected';
    const updatedRequest = await request.save();

    await updatedRequest.populate('user', 'name email phone');

    // Log collector activity
    await CollectorActivity.create({
      collectorId,
      wasteRequestId: requestId,
      status: 'rejected'
    });

    res.status(200).json({
      success: true,
      message: 'Waste request rejected successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while rejecting request',
      error: error.message 
    });
  }
});

// @route   PUT /api/waste-requests/:requestId/start
// @desc    Collector starts a pickup
// @access  Private (Collectors only)
router.put('/:requestId/start', authMiddleware, requireRole(['collector']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const collectorId = req.user.id;

    console.log('🔧 Starting pickup debug:');
    console.log('Request ID:', requestId);
    console.log('Collector ID:', collectorId);

    const request = await WasteRequest.findById(requestId)
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email');

    if (!request) {
      console.log('❌ Request not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Waste request not found' 
      });
    }

    console.log('📋 Request details:', {
      id: request._id,
      collectorStatus: request.collectorStatus,
      collectionStatus: request.collectionStatus,
      assignedCollector: request.assignedCollector,
      assignedCollectorId: request.assignedCollector?._id?.toString(),
      currentUser: collectorId
    });

    // Check if this collector owns the request
    if (!request.assignedCollector) {
      console.log('❌ No collector assigned to this request');
      return res.status(403).json({ 
        success: false, 
        message: 'No collector assigned to this request' 
      });
    }

    // Convert both to strings for comparison to avoid ObjectId vs string issues
    const assignedCollectorId = request.assignedCollector._id ? 
      request.assignedCollector._id.toString() : 
      request.assignedCollector.toString();
    
    const currentCollectorId = collectorId.toString();

    console.log('🔍 ID Comparison:', {
      assignedCollectorId,
      currentCollectorId,
      match: assignedCollectorId === currentCollectorId
    });

    if (assignedCollectorId !== currentCollectorId) {
      console.log('❌ Collector authorization failed - ID mismatch');
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to start this pickup' 
      });
    }

    // Check if request is in correct status
    if (request.collectorStatus !== 'accepted') {
      console.log('❌ Invalid status for starting pickup');
      return res.status(400).json({ 
        success: false, 
        message: `Cannot start pickup - request status is "${request.collectorStatus}" but should be "accepted"` 
      });
    }

    // Update request status
    request.collectorStatus = 'in-progress';
    request.collectionStatus = 'in_progress';
    
    const updatedRequest = await request.save();
    console.log('✅ Pickup started successfully');

    // Log collector activity
    await CollectorActivity.create({
      collectorId,
      wasteRequestId: requestId,
      status: 'in-progress'
    });

    res.status(200).json({
      success: true,
      message: 'Pickup started successfully',
      request: {
        _id: updatedRequest._id,
        collectorStatus: updatedRequest.collectorStatus,
        collectionStatus: updatedRequest.collectionStatus,
        user: updatedRequest.user,
        assignedCollector: updatedRequest.assignedCollector
      }
    });

  } catch (error) {
    console.error('❌ Error starting pickup:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while starting pickup',
      error: error.message 
    });
  }
});

// @route   PUT /api/waste-requests/:requestId/complete
// @desc    Collector completes a pickup and awards coins to user
// @access  Private (Collectors only)
router.put('/:requestId/complete', authMiddleware, requireRole(['collector']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const collectorId = req.user.id;

    console.log('🔧 Completing pickup debug:');
    console.log('Request ID:', requestId);
    console.log('Collector ID:', collectorId);

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Waste request not found' 
      });
    }

    // Convert both to strings for comparison
    const assignedCollectorId = request.assignedCollector ? 
      request.assignedCollector.toString() : null;
    
    const currentCollectorId = collectorId.toString();

    if (assignedCollectorId !== currentCollectorId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to complete this pickup' 
      });
    }

    if (request.collectorStatus !== 'in-progress') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot complete pickup - request is ${request.collectorStatus}` 
      });
    }

    // Calculate coins based on weight and waste type
    const coinsEarned = calculateCoinsValue(request.estimatedWeight, request.wasteType);

    // Update request status
    request.collectorStatus = 'completed';
    request.collectionStatus = 'collected';
    request.collectedAt = new Date();
    request.coinsAwarded = coinsEarned; // Store how many coins were awarded
    
    const updatedRequest = await request.save();

    // Log collector activity
    await CollectorActivity.create({
      collectorId,
      wasteRequestId: requestId,
      status: 'completed'
    });

    // Award coins to user
    const user = await User.findById(request.user);
    if (user) {
      // Ensure points field exists and add the earned coins
      user.points = (user.points || 0) + coinsEarned;
      
      // Add to user's completed pickups
      if (!user.completedPickups) {
        user.completedPickups = [];
      }
      user.completedPickups.push({
        requestId: request._id,
        completedAt: new Date(),
        coinsEarned: coinsEarned,
        wasteType: request.wasteType,
        weight: request.estimatedWeight
      });

      // Save without validation to avoid collectorInfo validation errors
      await user.save({ validateBeforeSave: false });
      
      console.log(`✅ Awarded ${coinsEarned} coins to user: ${user.name}`);
      console.log(`💰 User ${user.name} now has ${user.points} total coins`);
    }

    res.status(200).json({
      success: true,
      message: 'Pickup completed successfully',
      request: updatedRequest,
      coinsEarned: coinsEarned
    });

  } catch (error) {
    console.error('❌ Error completing pickup:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while completing pickup',
      error: error.message 
    });
  }
});

// @route   PUT /api/waste-requests/:requestId/cancel
// @desc    User cancels their own pickup request
// @access  Private
router.put('/:requestId/cancel', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request = await WasteRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Waste request not found' 
      });
    }

    // Check if user owns this request
    if (request.user.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this request' 
      });
    }

    // Only allow cancellation if request is still pending
    if (request.collectorStatus !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel request - request is already ${request.collectorStatus}` 
      });
    }

    request.collectorStatus = 'cancelled';
    const updatedRequest = await request.save();

    res.status(200).json({
      success: true,
      message: 'Pickup request cancelled successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while cancelling request',
      error: error.message 
    });
  }
});

// @route   GET /api/waste-requests/user/:userId
// @desc    Get waste requests for a specific user
// @access  Private
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    console.log('🔧 Fetching user requests:', {
      requestedUserId: userId,
      currentUserId: currentUserId,
      currentUserRole: currentUserRole
    });

    // Check if user is accessing their own data or is admin/collector
    if (currentUserId !== userId && currentUserRole !== 'admin' && currentUserRole !== 'collector') {
      console.log('❌ Access denied - user not authorized');
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only view your own requests.' 
      });
    }

    const userRequests = await WasteRequest.find({ user: userId })
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${userRequests.length} requests for user ${userId}`);

    // Format the response to match frontend expectations
    const formattedRequests = userRequests.map(request => ({
      _id: request._id,
      userId: {
        _id: request.user._id,
        name: request.user.name,
        email: request.user.email,
        phone: request.user.phone || 'Not provided'
      },
      pickupAddress: request.pickupAddress,
      wasteType: request.wasteType,
      estimatedWeight: request.estimatedWeight,
      pickupDate: request.pickupDate.toISOString().split('T')[0],
      pickupTime: request.pickupTime,
      status: request.collectorStatus,
      priority: request.priority || 'medium',
      instructions: request.instructions,
      coinsValue: calculateCoinsValue(request.estimatedWeight, request.wasteType),
      createdAt: request.createdAt,
      collectorId: request.assignedCollector?._id,
      assignedCollector: request.assignedCollector ? {
        _id: request.assignedCollector._id,
        name: request.assignedCollector.name,
        email: request.assignedCollector.email
      } : undefined
    }));

    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      requests: formattedRequests
    });

  } catch (error) {
    console.error('❌ Error fetching user requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user requests',
      error: error.message 
    });
  }
});

// @route   GET /api/waste-requests/collector/stats
// @desc    Get collector statistics
// @access  Private (Collectors only)
router.get('/collector/stats', authMiddleware, requireRole(['collector']), async (req, res) => {
  try {
    const collectorId = req.user.id;

    const totalRequests = await WasteRequest.countDocuments({
      assignedCollector: collectorId
    });

    const pendingRequests = await WasteRequest.countDocuments({
      assignedCollector: collectorId,
      collectorStatus: 'accepted'
    });

    const inProgressRequests = await WasteRequest.countDocuments({
      assignedCollector: collectorId,
      collectorStatus: 'in-progress'
    });

    const completedRequests = await WasteRequest.countDocuments({
      assignedCollector: collectorId,
      collectorStatus: 'completed'
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRequests = await WasteRequest.countDocuments({
      assignedCollector: collectorId,
      pickupDate: {
        $gte: today
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalRequests,
        pending: pendingRequests,
        inProgress: inProgressRequests,
        completed: completedRequests,
        today: todayRequests
      }
    });

  } catch (error) {
    console.error('Error getting collector stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching collector stats',
      error: error.message 
    });
  }
});

module.exports = router;