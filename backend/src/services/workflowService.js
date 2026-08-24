const Workflow = require('../models/Workflow');
const Execution = require('../models/Execution');
const ExecutionLog = require('../models/ExecutionLog');

async function getDashboardMetrics(ownerId) {
  const [
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    completedExecutions,
    failedExecutions,
    recentWorkflows,
    recentExecutions,
    recentLogs
  ] = await Promise.all([
    Workflow.countDocuments({ owner: ownerId }),
    Workflow.countDocuments({ owner: ownerId, status: 'active' }),
    Execution.countDocuments({ owner: ownerId }),
    Execution.countDocuments({ owner: ownerId, status: 'COMPLETED' }),
    Execution.countDocuments({ owner: ownerId, status: 'FAILED' }),
    Workflow.find({ owner: ownerId }).sort({ updatedAt: -1 }).limit(5).lean(),
    Execution.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('workflow', 'name')
      .lean(),
    ExecutionLog.find({})
      .sort({ timestamp: -1 })
      .limit(8)
      .populate('workflow', 'name')
      .lean()
  ]);

  const successRate = totalExecutions > 0 
    ? Math.round((completedExecutions / totalExecutions) * 100) 
    : 100;

  return {
    metrics: {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      completedExecutions,
      failedExecutions,
      successRate
    },
    recentWorkflows,
    recentExecutions,
    aiReasoningActivity: recentLogs
  };
}

async function listWorkflows(ownerId, { search = '', status = '', tag = '', page = 1, limit = 20 } = {}) {
  const query = { owner: ownerId };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (tag) {
    query.tags = tag;
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const take = parseInt(limit, 10);

  const [workflows, total] = await Promise.all([
    Workflow.find(query).sort({ updatedAt: -1 }).skip(skip).limit(take).lean(),
    Workflow.countDocuments(query)
  ]);

  return {
    workflows,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
}

async function createWorkflow(ownerId, data) {
  const workflow = await Workflow.create({
    name: data.name || 'Untitled Workflow',
    description: data.description || '',
    owner: ownerId,
    status: data.status || 'draft',
    trigger: data.trigger || { type: 'manual', config: {} },
    nodes: data.nodes || [],
    edges: data.edges || [],
    version: 1,
    tags: data.tags || []
  });

  return workflow;
}

async function getWorkflowById(workflowId, ownerId) {
  const workflow = await Workflow.findOne({ _id: workflowId, owner: ownerId });
  if (!workflow) {
    const error = new Error('Workflow not found or access denied');
    error.statusCode = 404;
    error.code = 'WORKFLOW_NOT_FOUND';
    throw error;
  }
  return workflow;
}

async function updateWorkflow(workflowId, ownerId, data) {
  const workflow = await getWorkflowById(workflowId, ownerId);

  if (data.name !== undefined) workflow.name = data.name;
  if (data.description !== undefined) workflow.description = data.description;
  if (data.status !== undefined) workflow.status = data.status;
  if (data.trigger !== undefined) workflow.trigger = data.trigger;
  if (data.nodes !== undefined) workflow.nodes = data.nodes;
  if (data.edges !== undefined) workflow.edges = data.edges;
  if (data.tags !== undefined) workflow.tags = data.tags;

  workflow.version += 1;
  await workflow.save();
  return workflow;
}

async function duplicateWorkflow(workflowId, ownerId) {
  const original = await getWorkflowById(workflowId, ownerId);

  const clone = await Workflow.create({
    name: `${original.name} (Copy)`,
    description: original.description,
    owner: ownerId,
    status: 'draft',
    trigger: original.trigger,
    nodes: original.nodes,
    edges: original.edges,
    version: 1,
    tags: original.tags
  });

  return clone;
}

async function deleteWorkflow(workflowId, ownerId) {
  const workflow = await getWorkflowById(workflowId, ownerId);
  await Workflow.deleteOne({ _id: workflow._id });
  return { deleted: true, id: workflowId };
}

module.exports = {
  getDashboardMetrics,
  listWorkflows,
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  duplicateWorkflow,
  deleteWorkflow
};
