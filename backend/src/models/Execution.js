const mongoose = require('mongoose');

const executionSchema = new mongoose.Schema(
  {
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    workflowSnapshot: {
      name: String,
      nodes: Array,
      edges: Array,
      trigger: Object,
      version: Number
    },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'PAUSED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    currentNodeId: {
      type: String,
      default: null
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    durationMs: {
      type: Number,
      default: 0
    },
    inputPayload: {
      type: Object,
      default: {}
    },
    outputPayload: {
      type: Object,
      default: {}
    },
    error: {
      message: String,
      code: String,
      details: mongoose.Schema.Types.Mixed
    },
    retryCount: {
      type: Number,
      default: 0
    },
    maxRetries: {
      type: Number,
      default: 3
    }
  },
  {
    timestamps: true
  }
);

executionSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Execution', executionSchema);
