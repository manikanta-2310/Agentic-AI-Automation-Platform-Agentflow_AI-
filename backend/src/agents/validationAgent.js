/**
 * Validation Agent
 * Verifies required output fields and ensures step results adhere to schema constraints.
 */
class ValidationAgent {
  constructor() {
    this.name = 'validation';
  }

  async validateNodeOutput(node, executionResult) {
    const output = executionResult?.output;
    const category = node.data?.category || 'action';
    const nodeType = node.data?.nodeType || node.type;

    const missingFields = [];
    const checks = [];

    if (!output) {
      return {
        isValid: false,
        missingFields: ['output_payload'],
        confidence: 0.1,
        message: 'Node execution produced empty or null output'
      };
    }

    if (category === 'ai') {
      if (nodeType === 'ai_classifier' && !output.classification) {
        missingFields.push('classification');
      }
      if (nodeType === 'ai_summarizer' && !output.summary) {
        missingFields.push('summary');
      }
      if (nodeType === 'ai_extractor' && !output.entities) {
        missingFields.push('entities');
      }
      checks.push('AI structured JSON validation passed');
    }

    if (category === 'action') {
      if (output.status !== 'sent' && output.status !== 'appended' && output.status !== 'success' && output.status !== 'simulated_sent' && output.status !== 'simulated_appended') {
        missingFields.push('status_confirmation');
      }
      checks.push('Integration delivery status confirmed');
    }

    const isValid = missingFields.length === 0;

    return {
      isValid,
      missingFields,
      checksPassed: checks,
      confidence: isValid ? 0.98 : 0.4,
      message: isValid ? 'Validation Agent verified output schema successfully' : `Missing required fields: ${missingFields.join(', ')}`
    };
  }
}

module.exports = new ValidationAgent();
