###################
# DEPENDENCIES
###################

FROM node:18-alpine AS dependencies

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm ci --frozen-lockfile

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy node_modules from dependencies stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy source code and configuration files
COPY src/ ./src/
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY user-swagger.json ./
COPY swagger.ts ./
COPY data-source.ts ./
# Build the application
RUN npm run build

###################
# PRODUCTION DEPENDENCIES
###################

FROM node:18-alpine AS prod-dependencies

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --frozen-lockfile --only=production && npm cache clean --force

###################
# PRODUCTION
###################

FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy production dependencies
COPY --from=prod-dependencies /usr/src/app/node_modules ./node_modules

# Copy built application
COPY --from=build /usr/src/app/dist ./dist

# Copy necessary files
COPY user-swagger.json ./

# Create logs directory
RUN mkdir -p /usr/src/app/logs && chmod -R 777 /usr/src/app/logs

# Set NODE_ENV
ENV NODE_ENV=production

# Use the node user from the image (instead of the root user)
USER node

# Expose application port
EXPOSE 8080

# Start the server using the production build
CMD ["node", "dist/main.js"]
