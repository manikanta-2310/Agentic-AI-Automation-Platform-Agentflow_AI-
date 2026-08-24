const mongoose = require('mongoose');

const agentMemorySchema = new mongoose.Schema(
  {
    workflow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    execution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      index: true
    },
    agent: {
      type: String,
      required: true
    },
    memoryKey: {
      type: String,
      required: true
    },
    memoryValue: {
      type: mongoose.Schema.Types.Mixed
    },
    confidence: {
      type: Number,
      default: 1.0
    },
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

agentMemorySchema.index({ workflow: 1, memoryKey: 1 });

module.exports = mongoose.model('AgentMemory', agentMemorySchema);
