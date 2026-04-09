FROM node:lts-alpine

RUN mkdir /backend
WORKDIR /backend
COPY ./package*.json ./

RUN npm install
EXPOSE 5173

CMD ["npm", "run", "dev"]
