# ------------------------------
# Stage 1: Application Building
# ------------------------------

# DOKERFILE REFERENCE: https://docs.docker.com/engine/reference/builder/

# Import NodeJS image
FROM --platform=linux/amd64 node:current-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# ------------------------------
# Stage 2: Application Running
# ------------------------------

# Run application
CMD [ "node", "app.js" ]