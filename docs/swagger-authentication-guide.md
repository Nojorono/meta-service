# Swagger Authentication Setup Guide

## Overview

This guide explains how to use Swagger UI with JWT authentication in the Meta Service API.

## Access Swagger UI

Open your browser and navigate to: `http://localhost:9000/docs`

## Authentication Process

### Step 1: Login to Get JWT Token

1. Find the "Authentication" section in Swagger UI
2. Locate the `POST /api/v1/auth/login` endpoint
3. Click "Try it out"
4. Use the following test credentials:
   ```json
   {
     "username": "admin",
     "password": "admin123",
     "appCode": "META-SERVICE"
   }
   ```
5. Click "Execute"
6. Copy the `access_token` from the response

### Step 2: Authorize Swagger UI

1. Click the **"Authorize"** button (🔒 lock icon) at the top right of Swagger UI
2. In the "JWT-auth" section, paste your JWT token
3. **IMPORTANT**: Only paste the token value, do not add "Bearer " prefix
4. Click "Authorize"
5. Click "Close"

### Step 3: Test Protected Endpoints

Now you can test any protected endpoint:

1. Find any endpoint with a 🔒 lock icon (e.g., `GET /api/v1/branch`)
2. Click "Try it out"
3. Click "Execute"
4. The request should return data successfully

## Public Endpoints

Endpoints marked with "🔓" or without authentication requirements can be accessed without logging in:

- `GET /api/v1/auth/health`
- `GET /api/v1/auth/applications`
- Some endpoints with `@Public()` decorator

## Troubleshooting

### 401 Unauthorized Error

- **Problem**: Getting "Unauthorized" responses
- **Solution**:
  1. Make sure you've authorized Swagger UI (Step 2)
  2. Check that your token hasn't expired (tokens expire after 24 hours)
  3. Re-login if needed

### Invalid Token Format

- **Problem**: Authentication not working
- **Solution**:
  1. Make sure you only pasted the token value, not "Bearer <token>"
  2. Check that there are no extra spaces or characters

### Token Expiry

- **Problem**: Previously working tokens stop working
- **Solution**:
  1. Login again to get a new token
  2. Re-authorize Swagger UI with the new token

## API Documentation Features

### Authentication Indicators

- 🔒 **Protected Endpoint**: Requires JWT authentication
- 🔓 **Public Endpoint**: No authentication required

### Response Schemas

All endpoints include detailed response schemas showing:

- Success responses (200, 201)
- Error responses (400, 401, 500)
- Data structure examples

### Try It Out

Every endpoint supports "Try it out" functionality:

1. Click "Try it out"
2. Fill in required parameters
3. Click "Execute"
4. View the response

## Security Notes

- Never share your JWT tokens
- Tokens expire after 24 hours for security
- Always logout when done testing
- Use refresh tokens for extended sessions
