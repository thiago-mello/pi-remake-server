import 'dotenv/config';

interface RedisOpts {
  port?: number;
  host?: string;
  db?: number;
  password?: string;
}

const redisConfig: RedisOpts = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
};

export default redisConfig;
