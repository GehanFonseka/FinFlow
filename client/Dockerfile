FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Install `serve` to host the Vite build output
RUN npm install -g serve

EXPOSE 3000

# Serve the Vite production build from `dist`
CMD ["serve", "-s", "dist", "-l", "3000"]
