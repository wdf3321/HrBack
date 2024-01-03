FROM node:18-alpine as develop-stage
WORKDIR /app
# COPY private.pem /app
# COPY fullchain.crt /app
COPY package*.json ./
RUN npm i
RUN npm i -g forever
COPY . .
EXPOSE 4000
CMD ["npx", "cross-env", "NODE_ENV=production", "forever", "index.js", "4000"]