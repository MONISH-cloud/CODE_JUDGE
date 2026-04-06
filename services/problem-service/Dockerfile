FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN mkdir -p uploads/testcases

COPY . .

EXPOSE 3002

CMD ["node", "src/index.js"]