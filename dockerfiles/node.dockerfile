FROM node:10-alpine

WORKDIR /app

RUN apk update
RUN apk add bash

CMD ["npm", "start"]