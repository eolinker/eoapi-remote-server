import { DataSourceOptions } from 'typeorm';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 33066,
  username: 'root',
  password: '123456a.',
  database: 'eoapi',
  synchronize: false,
  logging: false,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
} as DataSourceOptions;
