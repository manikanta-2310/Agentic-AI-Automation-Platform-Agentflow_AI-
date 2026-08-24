const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validatorMiddleware');

router.use(authenticate);

router.get('/dashboard', workflowController.getDashboard);

router.get('/', workflowController.list);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Workflow name is required'),
    validate
  ],
  workflowController.create
);

router.post(
  '/generate',
  [
    body('prompt').trim().notEmpty().withMessage('Automation prompt description is required'),
    validate
  ],
  workflowController.generate
);

router.get('/:id', workflowController.getById);

router.put('/:id', workflowController.update);

router.post('/:id/duplicate', workflowController.duplicate);

router.post('/:id/execute', workflowController.execute);

router.delete('/:id', workflowController.deleteWorkflow);

module.exports = router;
