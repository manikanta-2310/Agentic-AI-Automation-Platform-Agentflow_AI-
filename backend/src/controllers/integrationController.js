const integrationService = require('../services/integrationService');

async function list(req, res, next) {
  try {
    const list = await integrationService.listIntegrations(req.user.id);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
}

async function getStatus(req, res, next) {
  try {
    const status = await integrationService.getIntegrationStatus(req.user.id);
    res.status(200).json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
}

async function oauthStart(req, res, next) {
  try {
    const { provider } = req.params;
    const authUrl = integrationService.getAuthUrl(provider, req.user.id);
    res.status(200).json({ success: true, data: { authUrl, provider } });
  } catch (err) {
    next(err);
  }
}

async function oauthCallback(req, res, next) {
  try {
    const { provider } = req.params;
    const { code } = req.query;

    if (!code) {
      return res.redirect('/api/integrations/oauth/error?reason=missing_authorization_code');
    }

    const result = await integrationService.handleOAuthCallback(provider, req.user.id, code);
    res.status(200).json({
      success: true,
      message: `${provider} OAuth integration connected successfully`,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

function oauthError(req, res) {
  const { reason, message } = req.query;
  res.status(400).json({
    success: false,
    error: {
      code: 'OAUTH_FAILED',
      reason: reason || 'unknown_oauth_error',
      message: message || 'Failed to authenticate third-party integration OAuth flow'
    }
  });
}

async function saveConfig(req, res, next) {
  try {
    const { provider, accessToken, refreshToken, metadata, status } = req.body;
    const result = await integrationService.saveIntegration(req.user.id, {
      provider,
      accessToken,
      refreshToken,
      metadata,
      status
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function testConnection(req, res, next) {
  try {
    const { provider } = req.params;
    const result = await integrationService.testIntegration(req.user.id, provider);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getStatus,
  oauthStart,
  oauthCallback,
  oauthError,
  saveConfig,
  testConnection
};
