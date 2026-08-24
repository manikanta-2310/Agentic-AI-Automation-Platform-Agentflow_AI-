const Execution = require('../models/Execution');
const ExecutionLog = require('../models/ExecutionLog');
const Workflow = require('../models/Workflow');
const executionQueue = require('../queues/executionQueue');
const agentOrchestrator = require('../agents/agentOrchestrator');

async function listExecutions(ownerId, { workflowId, status, page = 1, limit = 20 } = {}) {
  const query = { owner: ownerId };
  if (workflowId) query.workflow = workflowId;
  if (status && status !== 'all') query.status = status;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const take = parseInt(limit, 10);

  const [executions, total] = await Promise.all([
    Execution.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(take)
      .populate('workflow', 'name status trigger')
      .lean(),
    Execution.countDocuments(query)
  ]);

  return {
    executions,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
}

async function getExecutionById(executionId, ownerId) {
  const execution = await Execution.findOne({ _id: executionId, owner: ownerId })
    .populate('workflow', 'name description status trigger')
    .lean();

  if (!execution) {
    const error = new Error('Execution not found or access denied');
    error.statusCode = 404;
    error.code = 'EXECUTION_NOT_FOUND';
    throw error;
  }

  return execution;
}

async function getExecutionTimeline(executionId, ownerId) {
  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    error.code = 'EXECUTION_NOT_FOUND';
    throw error;
  }

  const logs = await ExecutionLog.find({ execution: executionId })
    .sort({ timestamp: 1 })
    .lean();

  return {
    executionId,
    workflowId: execution.workflow,
    status: execution.status,
    startedAt: execution.startedAt,
    completedAt: execution.completedAt,
    durationMs: execution.durationMs,
    currentNodeId: execution.currentNodeId,
    langGraphStatus: execution.langGraphStatus,
    timeline: logs
  };
}

async function triggerExecution(workflowId, ownerId, inputPayload = {}) {
  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });
  if (!workflow) {
    const error = new Error('Workflow not found');
    error.statusCode = 404;
    error.code = 'WORKFLOW_NOT_FOUND';
    throw error;
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    const error = new Error('Cannot execute an empty workflow with no nodes');
    error.statusCode = 400;
    error.code = 'EMPTY_WORKFLOW';
    throw error;
  }

  // Create immutable snapshot of workflow at execution time
  const snapshot = {
    name: workflow.name,
    nodes: workflow.nodes,
    edges: workflow.edges,
    trigger: workflow.trigger,
    version: workflow.version
  };

  const execution = await Execution.create({
    workflow: workflow._id,
    owner: ownerId,
    workflowSnapshot: snapshot,
    status: 'PENDING',
    inputPayload,
    maxRetries: 3,
    langGraphStatus: agentOrchestrator.getLangGraphStatus()
  });

  // Enqueue execution job
  await executionQueue.addExecutionJob(execution._id);

  return execution;
}

async function pauseExecution(executionId, ownerId) {
  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    throw error;
  }

  if (execution.status !== 'RUNNING') {
    const error = new Error(`Cannot pause execution with status ${execution.status}`);
    error.statusCode = 400;
    throw error;
  }

  agentOrchestrator.pauseExecution(executionId);
  execution.status = 'PAUSED';
  await execution.save();

  return { success: true, status: 'PAUSED', executionId };
}

async function resumeExecution(executionId, ownerId) {
  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    throw error;
  }

  if (execution.status !== 'PAUSED') {
    const error = new Error(`Cannot resume execution with status ${execution.status}`);
    error.statusCode = 400;
    throw error;
  }

  agentOrchestrator.resumeExecution(executionId);
  execution.status = 'RUNNING';
  await execution.save();

  return { success: true, status: 'RUNNING', executionId };
}

async function cancelExecution(executionId, ownerId) {
  const execution = await Execution.findOne({ _id: executionId, owner: ownerId });
  if (!execution) {
    const error = new Error('Execution not found');
    error.statusCode = 404;
    throw error;
  }

  agentOrchestrator.cancelExecution(executionId);
  execution.status = 'CANCELLED';
  execution.completedAt = new Date();
  if (execution.startedAt) {
    execution.durationMs = Date.now() - execution.startedAt.getTime();
  }
  await execution.save();

  return { success: true, status: 'CANCELLED', executionId };
}

module.exports = {
  listExecutions,
  getExecutionById,
  getExecutionTimeline,
  triggerExecution,
  pauseExecution,
  resumeExecution,
  cancelExecution
};
