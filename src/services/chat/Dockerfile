FROM node:16-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install
RUN apk update
RUN apk add bash

CMD ["npm", "start"]