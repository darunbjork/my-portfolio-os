// src/utils/cache.js
const Redis = require('ioredis');

let client;

const connectCache = async () => {
  if (client) return client;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  client = new Redis(redisUrl);

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  return client;
};

// In-memory fallback for environments without Redis (like test suite)
const memoryCache = new Map();

const getCache = async () => {
  try {
    const redis = await connectCache();
    // Test connection
    await redis.ping();
    return redis;
  } catch (err) {
    console.warn('Redis not available, using in-memory cache');
    return null;
  }
};

const cache = {
  async get(key) {
    const redis = await getCache();
    if (!redis) {
      const entry = memoryCache.get(key);
      if (entry && entry.expires > Date.now()) return JSON.parse(entry.data);
      memoryCache.delete(key);
      return null;
    }
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key, value, ttl = 3600) {
    const stringValue = JSON.stringify(value);
    const redis = await getCache();
    if (!redis) {
      memoryCache.set(key, {
        data: stringValue,
        expires: Date.now() + ttl * 1000,
      });
      // Clean up old entries periodically
      if (memoryCache.size > 1000) {
        const now = Date.now();
        for (const [k, v] of memoryCache.entries()) {
          if (v.expires < now) memoryCache.delete(k);
        }
      }
      return;
    }
    await redis.set(key, stringValue, 'EX', ttl);
  },

  async del(key) {
    const redis = await getCache();
    if (!redis) {
      memoryCache.delete(key);
      return;
    }
    await redis.del(key);
  },

  async delByPattern(pattern) {
    const redis = await getCache();
    if (!redis) {
      // In-memory: simple prefix match
      for (const key of memoryCache.keys()) {
        if (key.startsWith(pattern.replace('*', ''))) {
          memoryCache.delete(key);
        }
      }
      return;
    }
    // Use SCAN to avoid blocking
    const stream = redis.scanStream({ match: pattern });
    for await (const keys of stream) {
      if (keys.length) {
        await redis.del(keys);
      }
    }
  },

  // Generate a standard cache key for a resource
  buildKey(resource, params = {}) {
    // For lists, include pagination/sorting fields
    if (params.page || params.sort) {
      const parts = [`${resource}:list`];
      if (params.page) parts.push(`page:${params.page}`);
      if (params.limit) parts.push(`limit:${params.limit}`);
      if (params.sort) parts.push(`sort:${params.sort}`);
      if (params.select) parts.push(`select:${params.select}`);
      if (params.filters) parts.push(`filters:${JSON.stringify(params.filters)}`);
      return parts.join(':');
    }
    // For single item
    if (params.id) return `${resource}:${params.id}`;
    return resource;
  }
};

module.exports = cache;
