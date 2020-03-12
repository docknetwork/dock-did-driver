FROM node:13.3.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy files from your host to your current location
COPY package.json .

# Copy config and server code
COPY .env .
COPY index.js .

# Run the command inside your image filesystem
RUN npm install

# Expose port 8080
EXPOSE 8080

# Run the node server
CMD [ "node", "index.js" ]
