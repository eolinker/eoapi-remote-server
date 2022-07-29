import { ConnectionOptions } from 'typeorm';

export default {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: false,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
} as ConnectionOptions;
