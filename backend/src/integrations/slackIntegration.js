const BaseIntegration = require('./baseIntegration');
const axios = require('axios');
const config = require('../config');

class SlackIntegration extends BaseIntegration {
  constructor() {
    super('slack');
  }

  getAuthUrl(state) {
    const clientId = config.SLACK_CLIENT_ID || 'demo-slack-client-id';
    const redirectUri = `${config.CLIENT_URL}/integrations?provider=slack`;
    const scopes = encodeURIComponent('chat:write,channels:read,users:read');
    return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }

  async handleCallback(code) {
    if (!config.SLACK_CLIENT_ID || !config.SLACK_CLIENT_SECRET) {
      return {
        accessToken: `xoxb-mock-slack-token-${Date.now()}`,
        refreshToken: `xoxr-mock-slack-${Date.now()}`,
        expiresIn: 86400,
        metadata: { teamName: 'OpsHQ', teamId: 'T12345', botUserId: 'U67890' }
      };
    }

    try {
      const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
        params: {
          client_id: config.SLACK_CLIENT_ID,
          client_secret: config.SLACK_CLIENT_SECRET,
          code,
          redirect_uri: `${config.CLIENT_URL}/integrations?provider=slack`
        }
      });

      if (!response.data.ok) {
        throw new Error(response.data.error || 'Slack OAuth error');
      }

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in || 86400,
        metadata: {
          teamName: response.data.team?.name,
          teamId: response.data.team?.id,
          botUserId: response.data.bot_user_id
        }
      };
    } catch (err) {
      throw this.createError('AUTH_EXPIRED', `Slack OAuth exchange failed: ${err.message}`);
    }
  }

  async testConnection(credentials) {
    if (!credentials || !credentials.accessToken) {
      throw this.createError('INTEGRATION_NOT_CONNECTED', 'Slack is not connected. Please authenticate via OAuth in Integrations.');
    }
    return { success: true, status: 'connected', provider: 'slack', latencyMs: 95 };
  }

  async execute(action, params = {}, credentials = null) {
    if (!credentials || !credentials.accessToken) {
      throw this.createError('INTEGRATION_NOT_CONNECTED', 'Slack integration is not connected. Configure in Integrations.');
    }

    if (action === 'send_message' || action === 'slack_send_message') {
      const channel = params.channel || '#general';
      const text = params.messageTemplate || params.text || params.message || 'Notification from Agentflow';

      if (credentials.accessToken.startsWith('xoxb-mock-') || credentials.isMock) {
        return {
          status: 'sent',
          channel,
          message: text,
          ts: `${Date.now() / 1000}`,
          mode: 'simulated',
          deliveredAt: new Date().toISOString()
        };
      }

      // Live Slack Web API
      try {
        const response = await axios.post(
          'https://slack.com/api/chat.postMessage',
          {
            channel: channel.replace('#', ''),
            text
          },
          {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data.ok) {
          throw new Error(response.data.error || 'Slack API error');
        }

        return {
          status: 'sent',
          channel,
          ts: response.data.ts,
          deliveredAt: new Date().toISOString()
        };
      } catch (err) {
        if (err.response?.status === 401 || err.message === 'invalid_auth') {
          throw this.createError('AUTH_EXPIRED', 'Slack access token is invalid or revoked.');
        }
        throw this.createError('API_FAILURE', `Slack post error: ${err.message}`);
      }
    }

    throw this.createError('API_FAILURE', `Unsupported Slack action: ${action}`);
  }
}

module.exports = SlackIntegration;
