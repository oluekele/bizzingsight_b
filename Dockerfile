# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies (for some npm packages that need compilation)
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json first (for Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the application port (matches your .env PORT)
EXPOSE 3006

# Start the application
CMD ["npm", "run", "start:prod"]
