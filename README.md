# eoapi-remote-server

storage api data in remote server

node: version > 16

## 环境变量配置

在`.env` 文件中统一配置 TOKEN 以及 MySQL 连接配置等信息。

>ps: *如果你没有特别需求，则可以调过此步骤，使用默认配置即可*

```bash
# auth token
API_KEY=1ab2c3d4e5f61ab2c3d4e5f6

# eoapi-server coinfigure
EOAPI_SERVER_PORT=3000

# mysql configure
TZ=Asia/Shanghai
# 映射到宿主机端口号
MYSQL_PORT=33066
MYSQL_USERNAME=root
MYSQL_DATABASE=eoapi
MYSQL_PASSWORD=123456a.
MYSQL_ROOT_PASSWORD=123456a.
```

默认情况下，在`src/config/ormconfig.ts`和`docker-compose.yaml`文件中统一使用了`.env`配置里的环境变量，比如：服务端口号、mysql连接等信息。

## 使用docker一键启动

启动成功后，通过 <http://localhost:3000> 访问。

```bash
docker-compose up -d --build
```

查看实时日志输出

```bash
docker-compose logs -f
```

## 本地开发

如果想提高开发效率，可以安装 nestjs 官方提供的命令行 nestjs-cli 快速生成组件、服务等模板。

```bash
npm i -g @nestjs/cli
```

【可选】如果你觉得本地搭建mysql比较麻烦的话，你还可以使用docker单独启动一个mysql服务供开发时使用(默认端口号: 33066), 例如：

```bash
docker-compose run -d --service-ports mysql
```

安装依赖

```bash
yarn 
```

运行代码

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
