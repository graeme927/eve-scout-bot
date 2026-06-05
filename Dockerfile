FROM node:22-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Ensure logs are visible immediately
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
