FROM node:18-alpine

WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN cd backend && npm install


EXPOSE 3000
EXPOSE 5173

CMD ["npm", "start"]