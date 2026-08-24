const express = require('express');
const router = express.Router();
const executionController = require('../controllers/executionController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/', executionController.list);
router.get('/:id', executionController.getById);
router.get('/:id/timeline', executionController.getTimeline);
router.post('/:id/pause', executionController.pause);
router.post('/:id/resume', executionController.resume);
router.post('/:id/cancel', executionController.cancel);

module.exports = router;
