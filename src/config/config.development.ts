import { ConnectionOptions } from 'typeorm';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '123456a.',
  database: 'eoapi',
  synchronize: true,
  logging: false,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
} as ConnectionOptions;
