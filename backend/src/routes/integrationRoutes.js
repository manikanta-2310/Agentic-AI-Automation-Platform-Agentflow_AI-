const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/oauth/error', integrationController.oauthError);

router.use(authenticate);

router.get('/', integrationController.list);
router.get('/status', integrationController.getStatus);
router.get('/oauth/:provider/start', integrationController.oauthStart);
router.get('/oauth/:provider/callback', integrationController.oauthCallback);
router.post('/', integrationController.saveConfig);
router.post('/:provider/test', integrationController.testConnection);

module.exports = router;
