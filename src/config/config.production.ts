import { ConnectionOptions } from 'typeorm';

export default {
  type: 'mysql',
  host: 'server_mysql',
  port: 3306,
  username: 'root',
  password: 'root',
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
