// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
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

    if (role === 'collector') {
      userData.collectorInfo = {
        phone: collectorInfo.phone,
        address: collectorInfo.address,
        vehicleType: collectorInfo.vehicleType,
        vehicleNumberPlate: collectorInfo.vehicleNumberPlate,
        experience: collectorInfo.experience || ''
      };
    }

    const user = new User(userData);
    await user.save();

    // create token payload
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Never return password
    const userSafe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collectorInfo: user.collectorInfo
    };

    return res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
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
    if (user.role === 'collector' && !user.collectorInfo?.isApproved) {
        return res.status(403).json({ error: 'Collector not yet approved by admin' });
    }
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

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
