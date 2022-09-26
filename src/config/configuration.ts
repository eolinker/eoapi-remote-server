import { DataSourceOptions } from 'typeorm';

export const getConfiguration = () => ({
  // jwt sign secret
  jwt: {
    secret: process.env.JWT_SECRET || '123456',
  },
  // typeorm config
  database: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number.parseInt(process.env.MYSQL_PORT, 10),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    timezone: '+08:00', // 东八区
    migrations: ['dist/migrations/**/*.js'],
    migrationsRun: true,
    cli: {
      migrationsDir: 'src/migrations',
    },
  } as DataSourceOptions,
  // swagger
  swagger: {
    enable: process.env.SWAGGER_ENABLE === 'true',
    path: process.env.SWAGGER_PATH,
    title: process.env.SWAGGER_TITLE,
    desc: process.env.SWAGGER_DESC,
    version: process.env.SWAGGER_VERSION,
  },
});

export default getConfiguration();
