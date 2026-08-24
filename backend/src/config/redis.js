const Redis = require('ioredis');
const config = require('./index');

let redisClient = null;
let isRedisAvailable = false;

function getRedisClient() {
  if (redisClient) return redisClient;

  if (config.REDIS_URL) {
    try {
      redisClient = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy(times) {
          if (times > 3) {
            console.warn('[Redis] Max connection attempts reached. Operating in in-memory fallback mode.');
            return null;
          }
          return Math.min(times * 100, 2000);
        }
      });

      redisClient.on('connect', () => {
        console.log('[Redis] Connected to Redis cluster/instance');
        isRedisAvailable = true;
      });

      redisClient.on('error', (err) => {
        console.warn(`[Redis] Redis connection error: ${err.message}. Using in-memory queue fallback.`);
        isRedisAvailable = false;
      });

      return redisClient;
    } catch (err) {
      console.warn(`[Redis] Could not create Redis client (${err.message}). Using in-memory queue fallback.`);
    }
  }

  console.log('[Redis] No REDIS_URL provided. Operating with in-memory execution queue.');
  return null;
}

module.exports = {
  getRedisClient,
  isRedisAvailable: () => isRedisAvailable
};
