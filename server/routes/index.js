const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const userProfileRoutes = require('./userProfileRoutes');
const bookRouter = require('./bookRouter');
// Mount routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/user-profile', userProfileRoutes);
router.use('/books', bookRouter);
module.exports = router; 