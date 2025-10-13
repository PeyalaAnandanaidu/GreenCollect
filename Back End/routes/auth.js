const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router = express.Router();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * POST /register
 * Body: { name, email, password, role, collectorInfo? }
 * collectorInfo only used when role === 'collector'
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, collectorInfo, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        error: 'name, email, password and role are required' 
      });
    }

    if (!['user', 'collector', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        error: 'role must be one of user, collector, admin' 
      });
    }

    // If collector, ensure required collector fields exist
    if (role === 'collector') {
      const required = ['phone', 'address', 'vehicleType', 'vehicleNumberPlate'];
      const missing = required.filter(f => !collectorInfo || !collectorInfo[f]);
      if (missing.length) {
        return res.status(400).json({ 
          success: false,
          error: `collectorInfo missing fields: ${missing.join(', ')}` 
        });
      }
    }

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ 
        success: false,
        error: 'Email already in use' 
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const userData = {
      name,
      email,
      password: hashed,
      role,
      phone: phone || '',
      points: 0, // NEW USERS START WITH 0 COINS
      memberSince: new Date()
    };

    // ✅ If role is collector, mark as unapproved initially
    if (role === 'collector') {
      userData.collectorInfo = {
        phone: collectorInfo.phone,
        address: collectorInfo.address,
        vehicleType: collectorInfo.vehicleType,
        vehicleNumberPlate: collectorInfo.vehicleNumberPlate,
        experience: collectorInfo.experience || '',
        isApproved: false, // 🔥 Key line
        status: 'pending'  // 🔥 For admin UI clarity
      };
    }

    const user = new User(userData);
    await user.save();

    // ✅ For collectors, don't auto-login
    if (role === 'collector') {
      return res.status(201).json({
        success: true,
        message: 'Collector registration submitted for admin approval.',
        collectorId: user._id,
        status: 'pending'
      });
    }

    // ✅ For users/admins, generate JWT immediately
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points || 0,
      phone: user.phone,
      memberSince: user.memberSince
    };

    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: userSafe, 
      token 
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

/**
 * POST /login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // ✅ Check collector approval before login
    if (user.role === 'collector' && !user.collectorInfo?.isApproved) {
      return res.status(403).json({ 
        success: false,
        error: 'Collector not yet approved by admin. Please wait for approval.' 
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points || 0,
      phone: user.phone,
      memberSince: user.memberSince,
      avatar: user.avatar,
      collectorInfo: user.collectorInfo
    };

    return res.json({ 
      success: true,
      message: 'Login successful',
      user: userSafe, 
      token 
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points || 0,
        phone: user.phone,
        memberSince: user.memberSince,
        avatar: user.avatar,
        collectorInfo: user.collectorInfo,
        wasteRequests: user.wasteRequests,
        completedPickups: user.completedPickups || []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// GET /api/auth/me - Get current user data
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points || 0,
        phone: user.phone,
        memberSince: user.memberSince,
        avatar: user.avatar,
        collectorInfo: user.collectorInfo
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points || 0,
        phone: user.phone,
        memberSince: user.memberSince,
        avatar: user.avatar,
        collectorInfo: user.collectorInfo
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// GET /api/auth/coins - Get user's coin balance
router.get('/coins', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('points');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      coins: user.points || 0
    });
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching coins'
    });
  }
});

// GET /api/auth/pickup-history - Get user's completed pickups
router.get('/pickup-history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('completedPickups')
      .populate('completedPickups.requestId', 'wasteType estimatedWeight pickupDate');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      completedPickups: user.completedPickups || []
    });
  } catch (error) {
    console.error('Error fetching pickup history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pickup history'
    });
  }
});

module.exports = router;