const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/get-my-info', protect, authController.getMyInfo);
router.get('/activate/:token', authController.activateAccount);

module.exports = router;