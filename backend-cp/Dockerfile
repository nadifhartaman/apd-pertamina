FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9015
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "9015"]
