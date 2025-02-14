const express = require('express');
const publisherController = require('../controllers/publisherController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/publishers', protect, authorize(['admin']),  publisherController.createPublisher);
router.get('/publishers', protect, authorize(['admin']),  publisherController.getAllPublishers);
router.get('/publishers/:id', protect, authorize(['admin']),  publisherController.getPublisherById);
router.put('/publishers/:id', protect, authorize(['admin']),  publisherController.updatePublisher);
router.delete('/publishers/:id', protect, authorize(['admin']), publisherController.deletePublisher);

module.exports = router;