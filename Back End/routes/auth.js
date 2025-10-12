// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router = express.Router();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /register
 * Body: { name, email, password, role, collectorInfo? }
 * collectorInfo only used when role === 'collector'
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, collectorInfo } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password and role are required' });
    }

    if (!['user', 'collector', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'role must be one of user, collector, admin' });
    }

    // If collector, ensure required collector fields exist
    if (role === 'collector') {
      const required = ['phone', 'address', 'vehicleType', 'vehicleNumberPlate'];
      const missing = required.filter(f => !collectorInfo || !collectorInfo[f]);
      if (missing.length) {
        return res.status(400).json({ error: `collectorInfo missing fields: ${missing.join(', ')}` });
      }
    }

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const userData = {
      name,
      email,
      password: hashed,
      role
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
    };

    return res.status(201).json({ user: userSafe, token });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token' });

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * POST /login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ Check collector approval before login
    if (user.role === 'collector' && !user.collectorInfo?.isApproved) {
      return res.status(403).json({ error: 'Collector not yet approved by admin' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collectorInfo: user.collectorInfo
    };

    return res.json({ user: userSafe, token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
