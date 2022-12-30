# eoapi-remote-server

Eoapi 远程数据源后端服务，部署后即可通过公共数据源实现简单团队协作。

如果你的数据不需要共享，也可以仅下载客户端单机使用。

## 部署
请访问 [部署文档]([https://docs.eoapi.io/docs/storage.html](https://github.com/eolinker/eoapi-remote-server/wiki/%E4%BA%91%E7%AB%AF%E6%9C%8D%E5%8A%A1)
## 开发
Node.js 版本：^16

如果想提高开发效率，可以安装 NestJS 官方提供的命令行 nestjs/cli 快速生成组件、服务等模板。

```bash
npm i -g @nestjs/cli
```

【可选】如果你觉得本地搭建 MySQL 比较麻烦的话，你还可以使用 Docker 单独启动一个 MySQL 服务供开发时使用(默认端口号: 33066), 例如：

```bash
docker-compose run -d --service-ports mysql
```

1. 安装依赖

```bash
yarn 
```

2. 运行数据库迁移脚本
```bash
yarn migration:run
```

3. 运行代码

```bash
yarn start:dev
```

### 运行

| 命令            | 描述       |
| --------------- | ---------- |
| `npm run start:dev` | 运行服务器 |

### 更新数据库

| 命令                                             | 描述             |
| ------------------------------------------------ | ---------------- |
| `npm run migration:generate -- -n TestMigration` | 生成迁移         |
| `npm run migration:run`                          | 运行更新         |
| `npm run migration:revert`                       | 回滚最后一次更新 |

### 打包构建

| 命令            | 描述     |
| --------------- | -------- |
| `npm run build` | 打包代码 |

# 协议

本项目采用 Apache-2.0 协议，可查看 [LICENSE.md](LICENSE) 了解更详细内容。
