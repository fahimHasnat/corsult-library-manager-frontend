# Dockerfile for Development
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the Next.js development port
EXPOSE 3000

# Command to start the development server
CMD ["npm", "run", "dev"]
