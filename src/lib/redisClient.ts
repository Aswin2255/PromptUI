import Redis from 'ioredis';
const getRedisClient = () => {
  if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not defined');
  return new Redis(process.env.REDIS_URL!);
};

declare global {
  var redis: Redis | undefined;
}

const redisClient = global.redis ?? getRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global.redis = redisClient;
}

export default redisClient;
