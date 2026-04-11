FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm init -y
RUN npm install express axios mysql2 dotenv cors

EXPOSE 3000