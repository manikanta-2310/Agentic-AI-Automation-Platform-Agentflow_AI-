const path = require('path');
const dotenv = require('dotenv');

// Load environment from backend/.env or current working directory .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'agentflow-jwt-secure-secret-key-32-chars-min',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REDIS_URL: process.env.REDIS_URL || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  CREDENTIAL_ENCRYPTION_KEY: process.env.CREDENTIAL_ENCRYPTION_KEY || '12345678901234567890123456789012',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID || '',
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET || '',
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID || '',
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET || '',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || '',
  GOOGLE_SHEETS_CLIENT_ID: process.env.GOOGLE_SHEETS_CLIENT_ID || '',
  GOOGLE_SHEETS_CLIENT_SECRET: process.env.GOOGLE_SHEETS_CLIENT_SECRET || ''
};
