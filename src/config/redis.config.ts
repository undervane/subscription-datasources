import { JobOptions } from 'bull';
import { parseRedisUrl } from 'parse-redis-url-simple';

interface RedisConnectionConfigs extends RedisConnectionOptions {
  database: string;
  host: string;
  password: string;
  port: number;
}

interface RedisConnectionOptions {
  tls?: {
    rejectUnauthorized?: false;
  };
}

const parseRedisOptions = (options: string): RedisConnectionOptions => {
  if (!options) return {};
  else return JSON.parse(options);
};

export const getRedisConnectionConfigs = (): RedisConnectionConfigs => {
  const connectionString = process.env.REDIS_URL;
  if (!connectionString)
    throw new Error('Missing "REDIS_URL" environmental variable');
  return {
    ...parseRedisUrl(process.env.REDIS_URL)[0],
    ...parseRedisOptions(process.env.REDIS_OPTIONS),
  } as RedisConnectionConfigs;
};

export const REDIS_QUEUE_CONFIG: JobOptions = {
  removeOnComplete: true,
  removeOnFail: true,
  attempts: 3,
};
