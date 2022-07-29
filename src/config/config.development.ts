import { ConnectionOptions } from 'typeorm';

console.log('process.env', process.env.MYSQL_USERNAME);

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
} as ConnectionOptions;
