const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const workflowRoutes = require('./workflowRoutes');
const executionRoutes = require('./executionRoutes');
const integrationRoutes = require('./integrationRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/workflows', workflowRoutes);
router.use('/executions', executionRoutes);
router.use('/integrations', integrationRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
