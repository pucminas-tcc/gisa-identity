FROM node:17-alpine3.12

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . .

RUN yarn global add @nestjs/cli && yarn install

CMD ["yarn", "start"]
