const Integration = require('../models/Integration');
const encryptionService = require('./encryptionService');
const GmailIntegration = require('../integrations/gmailIntegration');
const SlackIntegration = require('../integrations/slackIntegration');
const DiscordIntegration = require('../integrations/discordIntegration');
const GoogleSheetsIntegration = require('../integrations/googleSheetsIntegration');

const adapters = {
  gmail: new GmailIntegration(),
  slack: new SlackIntegration(),
  discord: new DiscordIntegration(),
  'google-sheets': new GoogleSheetsIntegration()
};

function getAdapter(provider) {
  const adapter = adapters[provider];
  if (!adapter) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  return adapter;
}

const SUPPORTED_PROVIDERS = [
  { id: 'gmail', name: 'Gmail', description: 'Read and send emails automatedly', category: 'communication', icon: 'Mail' },
  { id: 'slack', name: 'Slack', description: 'Post alerts and monitor team channels', category: 'collaboration', icon: 'MessageSquare' },
  { id: 'discord', name: 'Discord', description: 'Bot messaging and channel notifications', category: 'communication', icon: 'Bot' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Read, write, and append data records', category: 'data', icon: 'Sheet' }
];

async function listIntegrations(ownerId) {
  const existing = await Integration.find({ owner: ownerId }).lean();
  const existingMap = {};
  existing.forEach((item) => {
    existingMap[item.provider] = item;
  });

  return SUPPORTED_PROVIDERS.map((prov) => {
    const record = existingMap[prov.id];
    return {
      provider: prov.id,
      name: prov.name,
      description: prov.description,
      category: prov.category,
      icon: prov.icon,
      status: record ? record.status : 'disconnected',
      scopes: record ? record.scopes : [],
      metadata: record ? record.metadata : {},
      lastSyncedAt: record ? record.lastSyncedAt : null,
      lastError: record ? record.lastError : null,
      hasCredentials: Boolean(record && record.encryptedAccessToken)
    };
  });
}

async function getIntegrationStatus(ownerId) {
  const list = await listIntegrations(ownerId);
  const health = {};
  for (const item of list) {
    health[item.provider] = {
      status: item.status,
      connected: item.status === 'connected',
      lastSyncedAt: item.lastSyncedAt,
      hasCredentials: item.hasCredentials
    };
  }
  return health;
}

function getAuthUrl(provider, ownerId) {
  const adapter = getAdapter(provider);
  const state = Buffer.from(JSON.stringify({ provider, ownerId, ts: Date.now() })).toString('base64');
  return adapter.getAuthUrl(state);
}

async function handleOAuthCallback(provider, ownerId, code) {
  const adapter = getAdapter(provider);
  const tokenData = await adapter.handleCallback(code);

  const encryptedAccessToken = encryptionService.encrypt(tokenData.accessToken);
  const encryptedRefreshToken = tokenData.refreshToken ? encryptionService.encrypt(tokenData.refreshToken) : null;
  const tokenExpiresAt = tokenData.expiresIn ? new Date(Date.now() + tokenData.expiresIn * 1000) : null;

  const updated = await Integration.findOneAndUpdate(
    { owner: ownerId, provider },
    {
      status: 'connected',
      encryptedAccessToken,
      encryptedRefreshToken,
      tokenExpiresAt,
      metadata: tokenData.metadata || {},
      lastError: null,
      lastSyncedAt: new Date()
    },
    { upsert: true, new: true }
  );

  return {
    provider: updated.provider,
    status: updated.status,
    metadata: updated.metadata
  };
}

async function saveIntegration(ownerId, { provider, accessToken, refreshToken, metadata = {}, status = 'connected' }) {
  const encryptedAccessToken = accessToken ? encryptionService.encrypt(accessToken) : null;
  const encryptedRefreshToken = refreshToken ? encryptionService.encrypt(refreshToken) : null;

  const record = await Integration.findOneAndUpdate(
    { owner: ownerId, provider },
    {
      status,
      encryptedAccessToken,
      encryptedRefreshToken,
      metadata,
      lastError: null,
      lastSyncedAt: new Date()
    },
    { upsert: true, new: true }
  );

  return {
    provider: record.provider,
    status: record.status,
    metadata: record.metadata
  };
}

async function getCredentials(ownerId, provider) {
  const record = await Integration.findOne({ owner: ownerId, provider });
  if (!record || !record.encryptedAccessToken || record.status === 'disconnected') {
    return null;
  }

  try {
    const accessToken = encryptionService.decrypt(record.encryptedAccessToken);
    const refreshToken = record.encryptedRefreshToken ? encryptionService.decrypt(record.encryptedRefreshToken) : null;
    return {
      accessToken,
      refreshToken,
      tokenExpiresAt: record.tokenExpiresAt,
      metadata: record.metadata || {}
    };
  } catch (err) {
    console.error(`[IntegrationService] Failed to decrypt token for ${provider}:`, err.message);
    return null;
  }
}

async function executeIntegrationAction(ownerId, provider, action, params = {}) {
  const adapter = getAdapter(provider);
  const credentials = await getCredentials(ownerId, provider);

  if (!credentials) {
    const error = new Error(`Integration for ${provider} is not connected or credentials have expired.`);
    error.code = 'INTEGRATION_NOT_CONNECTED';
    error.provider = provider;
    throw error;
  }

  return adapter.execute(action, params, credentials);
}

async function testIntegration(ownerId, provider) {
  const adapter = getAdapter(provider);
  const credentials = await getCredentials(ownerId, provider);
  return adapter.testConnection(credentials);
}

module.exports = {
  SUPPORTED_PROVIDERS,
  listIntegrations,
  getIntegrationStatus,
  getAuthUrl,
  handleOAuthCallback,
  saveIntegration,
  getCredentials,
  executeIntegrationAction,
  testIntegration
};
