FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source code
COPY . .

# Create directory for Vosk models
RUN mkdir -p ./models

# Expose API port
EXPOSE 5000

# Start command
CMD ["node", "server.js"]