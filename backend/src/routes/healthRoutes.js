const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { isRedisAvailable } = require('../config/redis');
const agentOrchestrator = require('../agents/agentOrchestrator');

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'Agentflow_AI Platform Backend',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    system: {
      database: dbState,
      redisQueue: isRedisAvailable() ? 'connected' : 'in-memory-fallback',
      agentEngine: agentOrchestrator.getEngineStatus(),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  });
});

module.exports = router;
