FROM node:10-alpine

RUN mkdir /app
WORKDIR /app
ADD . /app

EXPOSE 4000

RUN yarn

CMD ["yarn", "dev"]
