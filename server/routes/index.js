const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const userProfileRoutes = require('./userProfileRoutes');
const bookRoutes = require('./bookRoutes');
const borrowRecordRoutes = require('./borrowrecordRoutes');
// Mount routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/user-profile', userProfileRoutes);
router.use('/books', bookRoutes);
router.use('/borrow-record', borrowRecordRoutes);

module.exports = router; 