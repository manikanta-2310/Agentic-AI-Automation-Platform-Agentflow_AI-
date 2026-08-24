const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    provider: {
      type: String,
      enum: ['gmail', 'slack', 'discord', 'google-sheets', 'openrouter', 'gemini'],
      required: true
    },
    status: {
      type: String,
      enum: ['connected', 'disconnected', 'error', 'expired'],
      default: 'disconnected'
    },
    scopes: {
      type: [String],
      default: []
    },
    encryptedAccessToken: {
      type: String,
      default: null
    },
    encryptedRefreshToken: {
      type: String,
      default: null
    },
    tokenExpiresAt: {
      type: Date,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    lastError: {
      type: String,
      default: null
    },
    lastSyncedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

integrationSchema.index({ owner: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('Integration', integrationSchema);
