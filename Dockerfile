# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3006

# Start the application
CMD ["npm", "run", "start:prod"]