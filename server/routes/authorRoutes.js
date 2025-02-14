const express = require('express');
const authorController = require('../controllers/authorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/authors', protect, authorize(['admin']), authorController.createAuthor);
router.get('/authors', protect, authorize(['admin']), authorController.getAllAuthors);
router.get('/authors/:id', protect, authorize(['admin']), authorController.getAuthorById);
router.put('/authors/:id', protect, authorize(['admin']), authorController.updateAuthor);
router.delete('/authors/:id', protect, authorize(['admin']), authorController.deleteAuthor);

module.exports = router;