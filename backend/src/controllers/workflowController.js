const workflowService = require('../services/workflowService');
const aiGenerationService = require('../services/aiGenerationService');
const executionService = require('../services/executionService');

async function getDashboard(req, res, next) {
  try {
    const data = await workflowService.getDashboardMetrics(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const data = await workflowService.listWorkflows(req.user.id, req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const workflow = await workflowService.createWorkflow(req.user.id, req.body);
    res.status(201).json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
}

async function generate(req, res, next) {
  try {
    const { prompt } = req.body;
    const generated = await aiGenerationService.generateWorkflow(prompt);
    res.status(200).json({ success: true, data: generated });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const workflow = await workflowService.getWorkflowById(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const workflow = await workflowService.updateWorkflow(req.params.id, req.user.id, req.body);
    res.status(200).json({ success: true, data: workflow });
  } catch (err) {
    next(err);
  }
}

async function duplicate(req, res, next) {
  try {
    const clone = await workflowService.duplicateWorkflow(req.params.id, req.user.id);
    res.status(201).json({ success: true, data: clone });
  } catch (err) {
    next(err);
  }
}

async function execute(req, res, next) {
  try {
    const execution = await executionService.triggerExecution(req.params.id, req.user.id, req.body.inputPayload);
    res.status(202).json({
      success: true,
      message: 'Workflow execution scheduled',
      data: execution
    });
  } catch (err) {
    next(err);
  }
}

async function deleteWorkflow(req, res, next) {
  try {
    const result = await workflowService.deleteWorkflow(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  list,
  create,
  generate,
  getById,
  update,
  duplicate,
  execute,
  deleteWorkflow
};
