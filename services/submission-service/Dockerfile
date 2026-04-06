FROM node:24-alpine

RUN apk add --no-cache gcc musl-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3003
CMD ["node", "src/index.js"]
