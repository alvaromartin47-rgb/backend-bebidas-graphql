FROM node:10-alpine

WORKDIR /app

COPY package.json /app/

RUN apk update
RUN apk add --no-cache make gcc g++ python
RUN npm install
RUN npm rebuild bcrypt --build-from-source
RUN apk del make gcc g++ python
RUN apk add bash

CMD ["npm", "start"]