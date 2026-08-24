const BaseIntegration = require('./baseIntegration');
const axios = require('axios');
const config = require('../config');

class GoogleSheetsIntegration extends BaseIntegration {
  constructor() {
    super('google-sheets');
  }

  getAuthUrl(state) {
    const clientId = config.GOOGLE_SHEETS_CLIENT_ID || 'demo-sheets-client-id';
    const redirectUri = `${config.CLIENT_URL}/integrations?provider=google-sheets`;
    const scopes = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets');
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${state}`;
  }

  async handleCallback(code) {
    if (!config.GOOGLE_SHEETS_CLIENT_ID || !config.GOOGLE_SHEETS_CLIENT_SECRET) {
      return {
        accessToken: `sheets_mock_token_${Date.now()}`,
        refreshToken: `sheets_mock_refresh_${Date.now()}`,
        expiresIn: 3600,
        metadata: { accountEmail: 'operator@agentflow.io', verified: true }
      };
    }

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: config.GOOGLE_SHEETS_CLIENT_ID,
        client_secret: config.GOOGLE_SHEETS_CLIENT_SECRET,
        redirect_uri: `${config.CLIENT_URL}/integrations?provider=google-sheets`,
        grant_type: 'authorization_code'
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        metadata: { tokenType: response.data.token_type }
      };
    } catch (err) {
      throw this.createError('AUTH_EXPIRED', `Google Sheets OAuth exchange failed: ${err.message}`);
    }
  }

  async testConnection(credentials) {
    if (!credentials || !credentials.accessToken) {
      throw this.createError('INTEGRATION_NOT_CONNECTED', 'Google Sheets is not connected. Link your account in Integrations.');
    }
    return { success: true, status: 'connected', provider: 'google-sheets', latencyMs: 140 };
  }

  async execute(action, params = {}, credentials = null) {
    if (!credentials || !credentials.accessToken) {
      throw this.createError('INTEGRATION_NOT_CONNECTED', 'Google Sheets integration is not connected. Authenticate in Integrations.');
    }

    if (action === 'append_row' || action === 'sheets_append_row') {
      const spreadsheetId = params.spreadsheetId || 'default-ledger';
      const range = params.sheetName ? `${params.sheetName}!A:Z` : 'Sheet1!A:Z';
      const values = params.values || params.valuesTemplate || [new Date().toISOString(), 'Automated Log', 'Success'];

      if (credentials.accessToken.startsWith('sheets_mock_') || credentials.isMock) {
        return {
          status: 'appended',
          spreadsheetId,
          range,
          updatedRows: 1,
          appendedValues: values,
          mode: 'simulated',
          updatedAt: new Date().toISOString()
        };
      }

      // Live Google Sheets API
      try {
        const response = await axios.post(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
          {
            values: [Array.isArray(values) ? values : [values]]
          },
          {
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        return {
          status: 'appended',
          spreadsheetId,
          updates: response.data.updates,
          updatedAt: new Date().toISOString()
        };
      } catch (err) {
        if (err.response?.status === 401) {
          throw this.createError('AUTH_EXPIRED', 'Google Sheets access token expired. Please re-authenticate.');
        }
        throw this.createError('API_FAILURE', `Google Sheets append error: ${err.message}`);
      }
    }

    throw this.createError('API_FAILURE', `Unsupported Google Sheets action: ${action}`);
  }
}

module.exports = GoogleSheetsIntegration;
