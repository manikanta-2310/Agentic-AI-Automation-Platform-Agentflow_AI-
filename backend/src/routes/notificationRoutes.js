const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/', notificationController.list);
router.put('/read-all', notificationController.markAllRead);
router.put('/:id/read', notificationController.markRead);

module.exports = router;
