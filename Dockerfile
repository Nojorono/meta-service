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
RUN yarn build

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

# Hybrid mode: Try Thin first, fallback to Thick if password verifier not supported
# This solves both NJS-116 (verifier type) and ORA-24960 (library issues)

USER nestjs

EXPOSE 9003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:9003/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]