FROM node:18-alpine as develop-stage
WORKDIR /app
# COPY private.pem /app
# COPY fullchain.crt /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]