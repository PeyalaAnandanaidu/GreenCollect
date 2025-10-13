// ./routes/companyRoutes.js
const express = require('express');
const Company = require('../models/company');

const router = express.Router();

router.post('/partners', async (req, res) => {
  try {
    const { companyName, establishingYear, type, location, contact, wasteProcessed, rating } = req.body;
    if (!companyName || !establishingYear || !type || !location || !contact || !wasteProcessed) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const newCompany = new Company({ companyName, establishingYear, type, location, contact, wasteProcessed, rating });
    const savedCompany = await newCompany.save();
    res.status(201).json({ message: 'Partner created successfully!', company: savedCompany });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ message: 'Server error while creating partner.' });
  }
});

router.get('/partners', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Server error while fetching partners.' });
  }
});

router.get('/partners/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Partner not found.' });
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ message: 'Server error while fetching partner.' });
  }
});

module.exports = router;  // <-- CommonJS export
