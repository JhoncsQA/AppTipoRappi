FROM node:18-slim

WORKDIR /app


COPY . .

RUN cd principal && npm install express axios
RUN cd login && npm install express mongoose
RUN cd gps && npm install express mongoose
RUN cd tiendas && npm install express mongoose
RUN cd pedidos && npm install express mongoose

EXPOSE 3000