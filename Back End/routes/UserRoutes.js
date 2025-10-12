const express = require('express');
const router = express.Router();
const User = require('../models/Users');

router.put('/approve-collector/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    // validate request
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: '`isApproved` must be a boolean value.' });
    }

    // Find the user and update collector approval status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 'collectorInfo.isApproved': isApproved },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is actually a collector
    if (updatedUser.role !== 'collector') {
      return res.status(400).json({ message: 'This user is not a collector' });
    }

    res.status(200).json({
      message: isApproved ? 'Collector approved successfully' : 'Collector approval revoked',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error approving collector:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// ✅ Route to update coins after placing or receiving a delivery
router.patch('/:id/coins', async (req, res) => {
    try {
      const { coinsChange } = req.body;  // positive to add, negative to subtract
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.coins += coinsChange;
      if (user.coins < 0) user.coins = 0; // Prevent negative coins
  
      await user.save();
  
      res.json({
        message: 'Coins updated successfully',
        coins: user.coins
      });
    } catch (error) {
      console.error('Error updating coins:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
