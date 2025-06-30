###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Copy node_modules from development stage
COPY --from=development /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .
# COPY .env .env
COPY user-swagger.json user-swagger.json
# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Clean up dev dependencies
RUN npm ci --only=production && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /usr/src/app

RUN npm install \
    && npm cache clean --force \
    && rm -rf /tmp/*
# Copy the production node_modules and dist from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY user-swagger.json user-swagger.json
RUN mkdir -p /usr/src/app/logs && chmod -R 777 /usr/src/app/logs
# Use the node user from the image (instead of the root user)
USER node

# Expose application port
EXPOSE 8080

# Start the server using the production build
CMD ["node", "dist/src/main"]
