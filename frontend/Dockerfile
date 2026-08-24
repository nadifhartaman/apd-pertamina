FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9014
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "9014"]