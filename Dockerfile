# FROM 表示设置要制作的镜像基于哪个镜像，FROM指令必须是整个Dockerfile的第一个指令，如果指定的镜像不存在默认会自动从Docker Hub上下载。
# 指定我们的基础镜像是node，latest表示版本是最新, 如果要求空间极致，可以选择lts-alpine
# 使用 as 来为某一阶段命名
FROM node:lts-alpine as builder


ENV PROJECT_DIR=/eoapi-remote-server \
    MYSQL_HOST=mysql \
    MYSQL_PORT=3306 \
    EOAPI_SERVER_PORT=3000

# WORKDIR指令用于设置Dockerfile中的RUN、CMD和ENTRYPOINT指令执行命令的工作目录(默认为/目录)，该指令在Dockerfile文件中可以出现多次，
# 如果使用相对路径则为相对于WORKDIR上一次的值，
# 例如WORKDIR /data，WORKDIR logs，RUN pwd最终输出的当前目录是/data/logs。
# cd到 /eoapi-remote-server
WORKDIR $PROJECT_DIR

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

# mirror acceleration
# RUN npm config set registry https://registry.npmmirror.com
# RUN yarn config set registry https://registry.npmmirror.com
# RUN npm config rm proxy && npm config rm https-proxy

# install 
COPY package.json $PROJECT_DIR
RUN yarn install
# build
COPY ./ $PROJECT_DIR
RUN chmod +x ./wait-for-it.sh \
    && apk update \
    && apk add bash \
    && yarn build \
    && yarn global add pm2

# clean dev dep
# RUN rm -rf node_modules
# RUN yarn install --production
# RUN yarn cache clean

# 容器对外暴露的端口号
EXPOSE $EOAPI_SERVER_PORT

# 容器启动时执行的命令，类似npm run start
# CMD ["yarn", "start:prod"]
# CMD ["pm2-runtime", "ecosystem.config.js"]
ENTRYPOINT ./wait-for-it.sh $MYSQL_HOST:$MYSQL_PORT -- yarn migration:run && pm2-runtime ecosystem.config.js