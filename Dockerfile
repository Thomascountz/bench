# Use an official Node.js runtime as the base image
FROM node:23

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before the rest for better layer caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Set environment variable for host accessibility (necessary for dockerized Vite)
ENV HOST=0.0.0.0

# Start the dev server
CMD ["npm", "run", "dev"]
