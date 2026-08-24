const ExecutionLog = require('../models/ExecutionLog');
const { emitExecutionEvent } = require('../config/socket');

/**
 * Monitoring Agent
 * Persists granular execution logs and emits live timeline telemetry over WebSockets.
 */
class MonitoringAgent {
  constructor() {
    this.name = 'monitoring';
  }

  async emitEvent({ executionId, workflowId, nodeId = null, agent, level = 'info', eventType, message, metadata = {} }) {
    // 1. Persist to MongoDB ExecutionLogs collection
    let logDoc = null;
    try {
      logDoc = await ExecutionLog.create({
        execution: executionId,
        workflow: workflowId,
        nodeId,
        agent,
        level,
        eventType,
        message,
        metadata,
        timestamp: new Date()
      });
    } catch (err) {
      console.warn('[MonitoringAgent] Error creating ExecutionLog:', err.message);
    }

    const payload = {
      _id: logDoc ? logDoc._id : `log_${Date.now()}`,
      executionId: String(executionId),
      workflowId: String(workflowId),
      nodeId,
      agent,
      level,
      eventType,
      message,
      metadata,
      timestamp: logDoc ? logDoc.timestamp : new Date()
    };

    // 2. Stream live event to subscribed browser clients
    emitExecutionEvent(executionId, 'agent:event', payload);
    emitExecutionEvent(executionId, 'execution:timeline', payload);

    return payload;
  }
}

module.exports = new MonitoringAgent();
