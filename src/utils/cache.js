import Redis from "redis";
import NodeCache from "node-cache";
import 'dotenv/config';

const useRedis = process.env.REDIS_URL ? true : false;

let cache;

if (useRedis) {
  const client = Redis.createClient({ url: process.env.REDIS_URL });
  await client.connect();
  cache = {
    async get(key) {
      const val = await client.get(key);
      return val ? JSON.parse(val) : null;
    },
    async set(key, value, ttlSec = 600) { // 10 min default
      await client.setEx(key, ttlSec, JSON.stringify(value));
    }
  };
} else {
  const memoryCache = new NodeCache({ stdTTL: 600 });
  cache = {
    async get(key) {
      return memoryCache.get(key);
    },
    async set(key, value, ttlSec = 600) {
      memoryCache.set(key, value, ttlSec);
    }
  };
}

export default cache;
