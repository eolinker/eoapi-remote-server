FROM node:lts-alpine as builder
WORKDIR /eoapi-remote-server

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone

# install & build
COPY ./ /eoapi-remote-server
RUN yarn install
RUN yarn build
# clean dev dep
RUN rm -rf node_modules
RUN yarn install --production

# httpserver set port
EXPOSE 3000

CMD ["yarn", "start:prod"]
