FROM node:16-alpine

RUN apk update
RUN apk add bash
RUN npm install -g localtunnel