FROM node:10-alpine

RUN apk update
RUN apk add bash
RUN npm install -g localtunnel