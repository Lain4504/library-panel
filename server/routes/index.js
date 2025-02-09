const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Mount routes
router.use('/auth', authRoutes);

module.exports = router; 