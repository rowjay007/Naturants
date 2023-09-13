# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all application files to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]
