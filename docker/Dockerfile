FROM node:17-alpine3.12

WORKDIR /usr/src/app

COPY . .

RUN apk add gcc --no-cache && yarn add node-gyp && yarn install

EXPOSE 8081

CMD ["yarn", "all"]