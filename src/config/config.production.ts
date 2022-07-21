import { ConnectionOptions } from 'typeorm';

export default {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
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
} as ConnectionOptions;
