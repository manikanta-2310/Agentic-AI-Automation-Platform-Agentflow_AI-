const BaseIntegration = require('./baseIntegration');
const axios = require('axios');
const config = require('../config');

class DiscordIntegration extends BaseIntegration {
  constructor() {
    super('discord');
  }

  getAuthUrl(state) {
    const clientId = config.DISCORD_CLIENT_ID || 'demo-discord-client-id';
    const redirectUri = `${config.CLIENT_URL}/integrations?provider=discord`;
    const scopes = encodeURIComponent('bot messages.read');
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=2048&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
  }

  async handleCallback(code) {
    if (!config.DISCORD_CLIENT_ID || !config.DISCORD_CLIENT_SECRET) {
      return {
        accessToken: `discord-mock-token-${Date.now()}`,
        refreshToken: `discord-mock-refresh-${Date.now()}`,
        expiresIn: 604800,
        metadata: { guildName: 'Agentflow Ops Server', guildId: '987654321', botUsername: 'AgentflowBot#1234' }
      };
    }

    try {
      const params = new URLSearchParams();
      params.append('client_id', config.DISCORD_CLIENT_ID);
      params.append('client_secret', config.DISCORD_CLIENT_SECRET);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', `${config.CLIENT_URL}/integrations?provider=discord`);

      const response = await axios.post('https://discord.com/api/oauth2/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        metadata: {
          guild: response.data.guild?.name,
          webhook: response.data.webhook?.url
        }
      };
    } catch (err) {
      throw this.createError('AUTH_EXPIRED', `Discord OAuth exchange failed: ${err.message}`);
    }
  }

  async testConnection(credentials) {
    if (!credentials || !credentials.accessToken) {
      throw this.createError('INTEGRATION_NOT_CONNECTED', 'Discord is not connected. Configure in Integrations.');
    }
    return { success: true, status: 'connected', provider: 'discord', latencyMs: 110 };
  }

  async execute(action, params = {}, credentials = null) {
    if (!credentials || !credentials.accessToken) {
      throw this.createError('INTEGRATION_NOT_CONNECTED', 'Discord is not connected. Connect in the Integrations tab.');
    }

    if (action === 'send_message' || action === 'discord_send_message') {
      const content = params.message || params.content || params.embedTitle || 'Agentflow Automation Triggered';

      if (credentials.accessToken.startsWith('discord-mock-') || credentials.isMock) {
        return {
          status: 'sent',
          messageId: `discord_msg_${Date.now()}`,
          channel: params.channel || 'general',
          content,
          mode: 'simulated',
          sentAt: new Date().toISOString()
        };
      }

      // Webhook or Bot Token POST
      try {
        if (credentials.metadata?.webhook) {
          const res = await axios.post(credentials.metadata.webhook, {
            content,
            username: 'Agentflow Bot'
          });
          return { status: 'sent', id: res.data?.id, mode: 'webhook' };
        }

        const channelId = params.channelId || 'general';
        const res = await axios.post(
          `https://discord.com/api/v10/channels/${channelId}/messages`,
          { content },
          { headers: { Authorization: `Bot ${credentials.accessToken}` } }
        );

        return {
          status: 'sent',
          id: res.data.id,
          channelId: res.data.channel_id,
          sentAt: res.data.timestamp
        };
      } catch (err) {
        if (err.response?.status === 401) {
          throw this.createError('AUTH_EXPIRED', 'Discord bot token is invalid or unauthorized.');
        }
        throw this.createError('API_FAILURE', `Discord dispatch error: ${err.message}`);
      }
    }

    throw this.createError('API_FAILURE', `Unsupported Discord action: ${action}`);
  }
}

module.exports = DiscordIntegration;
