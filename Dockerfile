# Multi-stage build for production
FROM node:20-alpine AS base

# Update repositories dengan mirror Indonesia
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
    libaio \
    libxml2 \
    krb5-libs \
    curl \
    unzip

# Download and install Oracle Instant Client 21.19 (more stable for Alpine)
WORKDIR /opt/oracle
RUN curl -o instantclient-basic-linux.x64-21.19.0.0.0dbru.zip \
    https://download.oracle.com/otn_software/linux/instantclient/2119000/instantclient-basic-linux.x64-21.19.0.0.0dbru.zip && \
    unzip instantclient-basic-linux.x64-21.19.0.0.0dbru.zip && \
    rm instantclient-basic-linux.x64-21.19.0.0.0dbru.zip && \
    mv instantclient_21_19 instantclient && \
    mkdir -p /etc/ld.so.conf.d && \
    echo "/opt/oracle/instantclient" > /etc/ld.so.conf.d/oracle-instantclient.conf

# Set Oracle environment variables for hybrid mode
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
ENV ORACLE_HOME=/opt/oracle/instantclient

# Set working directory for app
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
RUN yarn install --frozen-lockfile --production=false

# Build stage
FROM base AS builder

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Debug: Check if source files exist before build
RUN echo "=== Checking source files ===" && \
    test -f /app/src/config/rmq.config.ts && echo "✓ rmq.config.ts exists" || echo "✗ rmq.config.ts NOT FOUND" && \
    test -f /app/src/config/index.ts && echo "✓ index.ts exists" || echo "✗ index.ts NOT FOUND" && \
    ls -la /app/src/config/ | head -10

# Build with output logging
RUN echo "=== Starting build process ===" && \
    set -o pipefail && \
    yarn build 2>&1 | tee /tmp/build.log || { \
        echo "=== Build failed! Showing full build log ==="; \
        cat /tmp/build.log; \
        echo "=== Checking dist directory after failed build ==="; \
        ls -la /app/dist/ 2>/dev/null || echo "dist directory does not exist"; \
        exit 1; \
    }
RUN echo "=== Build succeeded, showing last 50 lines of log ===" && tail -50 /tmp/build.log

# Debug: List all files in dist/config after build
RUN echo "=== Files in dist/config ===" && (ls -la /app/dist/config/ || echo "dist/config directory not found")
RUN echo "=== Files in dist/app ===" && (ls -la /app/dist/app/ || echo "dist/app directory not found")
RUN echo "=== Files in dist root ===" && (ls -la /app/dist/ | head -20 || echo "dist directory not found")
RUN echo "=== Checking if dist directory exists ===" && test -d /app/dist && echo "dist directory exists" || echo "dist directory NOT FOUND"

# Verify critical files were built (with detailed error messages)
RUN echo "=== Verifying critical files ===" && \
    (test -f /app/dist/main.js && echo "✓ dist/main.js exists" || (echo "✗ ERROR: dist/main.js not found" && exit 1)) && \
    (test -f /app/dist/app/app.controller.js && echo "✓ dist/app/app.controller.js exists" || (echo "✗ ERROR: dist/app/app.controller.js not found" && ls -la /app/dist/app/ && exit 1)) && \
    (test -f /app/dist/config/index.js && echo "✓ dist/config/index.js exists" || (echo "✗ ERROR: dist/config/index.js not found" && echo "Files in dist/config:" && ls -la /app/dist/config/ && exit 1)) && \
    (test -f /app/dist/config/rmq.config.js && echo "✓ dist/config/rmq.config.js exists" || (echo "✗ ERROR: dist/config/rmq.config.js not found" && echo "Files in dist/config:" && ls -la /app/dist/config/ && exit 1)) && \
    echo "=== All critical files verified ==="

# Production stage
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Install packages untuk production
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
    libaio \
    libxml2 \
    krb5-libs \
    curl \
    unzip \
    dumb-init

# Download and install Oracle Instant Client 21.19
WORKDIR /opt/oracle
RUN curl -o instantclient-basic-linux.x64-21.19.0.0.0dbru.zip \
    https://download.oracle.com/otn_software/linux/instantclient/2119000/instantclient-basic-linux.x64-21.19.0.0.0dbru.zip && \
    unzip instantclient-basic-linux.x64-21.19.0.0.0dbru.zip && \
    rm instantclient-basic-linux.x64-21.19.0.0.0dbru.zip && \
    mv instantclient_21_19 instantclient && \
    mkdir -p /etc/ld.so.conf.d && \
    echo "/opt/oracle/instantclient" > /etc/ld.so.conf.d/oracle-instantclient.conf

# Set Oracle environment variables for hybrid mode
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
ENV ORACLE_HOME=/opt/oracle/instantclient

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/src/i18n ./i18n

# Verify critical files were copied
RUN test -f /app/dist/main.js || (echo "ERROR: dist/main.js not copied" && exit 1)
RUN test -f /app/dist/app/app.controller.js || (echo "ERROR: dist/app/app.controller.js not copied" && exit 1)
RUN test -f /app/dist/config/rmq.config.js || (echo "ERROR: dist/config/rmq.config.js not copied" && exit 1)
RUN test -f /app/dist/config/index.js || (echo "ERROR: dist/config/index.js not copied" && exit 1)

# Hybrid mode: Try Thin first, fallback to Thick if password verifier not supported
# This solves both NJS-116 (verifier type) and ORA-24960 (library issues)

USER nestjs

EXPOSE 9003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:9003/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]