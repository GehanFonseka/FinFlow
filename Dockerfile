# Dockerfile for backend (root)
FROM node:18
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
COPY client/dist ./client/dist
EXPOSE 5000
CMD ["node", "server.js"]
