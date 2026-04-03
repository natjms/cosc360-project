FROM node:alpine

WORKDIR /src/

COPY package.json /src 

RUN npm install

COPY . /app

EXPOSE 3000

