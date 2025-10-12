const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// List latest notifications for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const items = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ items });
  } catch (err) {
    console.error('List notifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all as read for a user
router.post('/clear', async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error('Clear notifications error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a notification (for testing/demo)
router.post('/', async (req, res) => {
  try {
    const { userId, message, type, meta } = req.body || {};
    if (!userId || !message) return res.status(400).json({ error: 'userId and message are required' });
    const doc = await Notification.create({ userId, message, type, meta });
    res.status(201).json({ item: doc });
  } catch (err) {
    console.error('Create notification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
