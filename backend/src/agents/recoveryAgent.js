/**
 * Recovery Agent
 * Classifies runtime failures into standard taxonomy (MISSING_FIELDS, API_FAILURE, AUTH_EXPIRED, RATE_LIMIT, TRANSIENT)
 * and determines remediation: retry_with_backoff vs escalate.
 */
class RecoveryAgent {
  constructor() {
    this.name = 'recovery';
  }

  classifyError(error) {
    const message = (error.message || '').toLowerCase();
    const code = error.code || '';

    if (code === 'MISSING_FIELDS' || message.includes('missing field') || message.includes('required')) {
      return 'MISSING_FIELDS';
    }

    if (code === 'AUTH_EXPIRED' || code === 'INTEGRATION_NOT_CONNECTED' || message.includes('auth') || message.includes('token') || message.includes('401')) {
      return 'AUTH_EXPIRED';
    }

    if (code === 'RATE_LIMIT' || message.includes('rate limit') || message.includes('429') || message.includes('too many requests')) {
      return 'RATE_LIMIT';
    }

    if (message.includes('timeout') || message.includes('econnreset') || message.includes('etimedout') || message.includes('503') || message.includes('502')) {
      return 'TRANSIENT';
    }

    if (code === 'API_FAILURE' || message.includes('api') || message.includes('failed')) {
      return 'API_FAILURE';
    }

    return 'UNKNOWN';
  }

  async handleFailure(error, node, executionState) {
    const errorClassification = this.classifyError(error);
    const retryCount = executionState.retryCount || 0;
    const maxRetries = executionState.maxRetries || 3;

    // Fatal or unrecoverable without operator interaction
    if (errorClassification === 'AUTH_EXPIRED') {
      return {
        action: 'escalate',
        errorClassification,
        reason: 'Authentication token is expired or missing. Escalating to operator for re-authorization.',
        backoffMs: 0,
        suggestedFix: 'Navigate to Integrations page and reconnect the service OAuth.'
      };
    }

    // Retriable failures
    if (retryCount < maxRetries) {
      // Exponential backoff calculation: 1000ms, 2000ms, 4000ms...
      const backoffMs = Math.min(1000 * Math.pow(2, retryCount), 10000);

      return {
        action: 'retry_with_backoff',
        errorClassification,
        retryAttempt: retryCount + 1,
        backoffMs,
        reason: `Encountered ${errorClassification} error. Executing automatic retry with exponential backoff (${backoffMs}ms).`
      };
    }

    // Max retries exceeded -> Escalate
    return {
      action: 'escalate',
      errorClassification,
      reason: `Maximum retry threshold (${maxRetries}) exceeded for error ${errorClassification}. Escalating to human operator.`,
      backoffMs: 0,
      suggestedFix: 'Inspect node configuration or target third-party service availability.'
    };
  }
}

module.exports = new RecoveryAgent();
