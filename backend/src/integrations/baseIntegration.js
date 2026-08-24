class BaseIntegration {
  constructor(providerName) {
    this.providerName = providerName;
  }

  getAuthUrl(state) {
    throw new Error(`getAuthUrl not implemented for provider ${this.providerName}`);
  }

  async handleCallback(code) {
    throw new Error(`handleCallback not implemented for provider ${this.providerName}`);
  }

  async testConnection(credentials) {
    throw new Error(`testConnection not implemented for provider ${this.providerName}`);
  }

  async execute(action, params, credentials) {
    throw new Error(`execute not implemented for provider ${this.providerName}`);
  }

  createError(code, message, details = {}) {
    const error = new Error(message);
    error.code = code;
    error.provider = this.providerName;
    error.details = details;
    return error;
  }
}

module.exports = BaseIntegration;
