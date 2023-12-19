# Use the official Node.js LTS Alpine image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies and TypeScript as a devDependency
RUN npm install --production && npm install --save-dev typescript

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npx tsc

# Set the timezone
ARG TZ=GMT
ENV TZ=${TZ}
RUN apk --no-cache add tzdata \
  && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
  && echo "${TZ}" > /etc/timezone

# Expose the port that the application will run on
EXPOSE 8080

# Command to start the application
CMD ["npm", "start"]
