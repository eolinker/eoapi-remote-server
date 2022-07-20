// https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
module.exports = [
  {
    script: 'dist/main.js',
    name: 'eoapi-remote-server',
    exec_mode: 'cluster',
    instances: 2,
    env: {
      // 环境参数，当前指定为生产环境
      NODE_ENV: 'production',
    },
  },
];
