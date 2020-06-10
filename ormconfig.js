require('dotenv/config');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/app/models/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  logging: true,
  synchronize: true,
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/app/models',
  },
};
