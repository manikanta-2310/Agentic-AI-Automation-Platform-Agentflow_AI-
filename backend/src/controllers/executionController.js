const executionService = require('../services/executionService');

async function list(req, res, next) {
  try {
    const data = await executionService.listExecutions(req.user.id, req.query);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const execution = await executionService.getExecutionById(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: execution });
  } catch (err) {
    next(err);
  }
}

async function getTimeline(req, res, next) {
  try {
    const timeline = await executionService.getExecutionTimeline(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: timeline });
  } catch (err) {
    next(err);
  }
}

async function pause(req, res, next) {
  try {
    const result = await executionService.pauseExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function resume(req, res, next) {
  try {
    const result = await executionService.resumeExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const result = await executionService.cancelExecution(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  getTimeline,
  pause,
  resume,
  cancel
};
