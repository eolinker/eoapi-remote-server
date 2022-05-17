# eoapi-remote-server
storage api data in remote server

## 运行代码

```
npm ci
npm run start
```

如果想提高开发效率，可以安装 nestjs 官方提供的命令行 nestjs-cli 快速生成组件、服务等模板。

```
npm i -g @nestjs/cli
```

## 配置

ormconfig.json中需要配置MySQL数据库的连接信息。

```
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "配置用户名",
  "password": "配置密码",
  "database": "配置数据库",
  "synchronize": false,
  "logging": false,
  "entities": ["dist/entities/**/*.js"],
  "migrations": ["dist/migrations/**/*.js"],
  "migrationsRun": true,
  "cli": {
    "migrationsDir": "src/migrations"
  }
}
```

复制.env.example为.env文件，并配置API_KEY。
```
API_KEY=1ab2c3d4e5f61ab2c3d4e5f6
```

## 命令

### 运行

| 命令                     | 描述                                 |
| ------------------------ | ------------------------------------ |
| `npm run start`              | 运行服务器 |


### 迁移脚本

| 命令                     | 描述                                 |
| ------------------------ | ------------------------------------ 
| `npm run migration:generate`              | 生成迁移 (npm run migration:generate -- -n TestMigration) |
| `npm run migration:run`              | 运行迁移，需要先打包构建 (npm run build) |
| `npm run migration:revert`              | 回滚最后一次迁移 |

### 打包构建

| 命令                     | 描述                     |
| ------------------------ | ------------------------ |
| `npm run build` | 打包代码 |

# 协议

本项目采用 Apache-2.0 协议，可查看 [LICENSE.md](LICENSE) 了解更详细内容。