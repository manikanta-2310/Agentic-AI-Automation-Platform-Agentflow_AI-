const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('./index');

let mongoMemoryServer = null;

async function connectDB() {
  const uri = config.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[DB] Connected to MongoDB: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[DB] Primary MongoDB connection failed (${err.message}). Falling back to in-memory database...`);
    }
  }

  try {
    console.log('[DB] Initializing MongoDB In-Memory Server for zero-config local development...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[DB] Connected to In-Memory MongoDB at: ${memoryUri}`);
  } catch (err) {
    console.error('[DB] Failed to initialize in-memory MongoDB:', err.message);
    throw err;
  }
}

async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}

module.exports = {
  connectDB,
  closeDB,
  isConnected: () => mongoose.connection.readyState === 1
};
