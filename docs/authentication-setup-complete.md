# Meta Service API - Authentication & Swagger Setup

## ✅ What Has Been Fixed

### 1. Global JWT Authentication

- ✅ Added `JwtAuthGuard` as global APP_GUARD in `app.module.ts`
- ✅ All endpoints are now protected by default (require JWT token)
- ✅ Public endpoints use `@Public()` decorator to bypass authentication
- ✅ JWT strategy validates tokens and extracts user information

### 2. Swagger Documentation Enhancement

- ✅ Added `@ApiBearerAuth('JWT-auth')` configuration for JWT authentication
- ✅ Created `@AuthSwagger()` decorator for easy authentication setup
- ✅ Updated all REST API controllers with proper authentication decorators
- ✅ Added comprehensive API documentation with response schemas

### 3. Authentication Flow

- ✅ Login endpoint returns JWT access_token and refresh_token
- ✅ Protected endpoints require "Authorization: Bearer <token>" header
- ✅ Token validation includes user existence check
- ✅ Proper error handling for invalid/expired tokens

## 🚀 How to Use the API

### 1. Start the Application

```bash
yarn dev
```

Application runs on: `http://localhost:9000`

### 2. Access Swagger UI

Open browser: `http://localhost:9000/docs`

### 3. Authenticate in Swagger

1. **Login**: Use `POST /api/v1/auth/login` with credentials:

   ```json
   {
     "username": "admin",
     "password": "admin123",
     "appCode": "META-SERVICE"
   }
   ```

2. **Copy Token**: Copy the `access_token` from response

3. **Authorize Swagger**:

   - Click 🔒 "Authorize" button
   - Paste token (without "Bearer " prefix)
   - Click "Authorize"

4. **Test Endpoints**: Now you can test any protected endpoint

### 4. Using API with cURL

#### Login to get token:

```bash
curl -X POST http://localhost:9000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123", "appCode": "META-SERVICE"}'
```

#### Use token for protected endpoints:

```bash
curl -X GET http://localhost:9000/api/v1/branch \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 📋 Endpoint Classifications

### Public Endpoints (No Authentication Required)

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/health` - Health check
- `GET /api/v1/auth/applications` - Available applications
- Some endpoints with `@Public()` decorator

### Protected Endpoints (JWT Required)

- `GET /api/v1/auth/profile` - User profile
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/branch` - Branch data
- `GET /api/v1/customer` - Customer data
- All other business data endpoints

## 🔧 Technical Implementation

### Decorators Used

- `@Public()` - Bypass authentication for specific endpoints
- `@AuthSwagger()` - Add JWT authentication to Swagger docs
- `@ApiBearerAuth('JWT-auth')` - Swagger authentication scheme

### Security Features

- JWT tokens expire in 24 hours
- Refresh tokens for extended sessions
- User validation on each request
- Application-specific access control
- Proper error responses for unauthorized access

### Error Responses

- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Valid token but insufficient permissions
- `400 Bad Request` - Invalid request format
- `500 Internal Server Error` - Server errors

## 🎯 Testing Checklist

### Authentication Tests

- ✅ Login with valid credentials returns tokens
- ✅ Login with invalid credentials returns 401
- ✅ Protected endpoints return 401 without token
- ✅ Protected endpoints return data with valid token
- ✅ Public endpoints work without authentication

### Swagger Tests

- ✅ Swagger UI loads at /docs
- ✅ Authorization button appears and functions
- ✅ JWT token can be set globally
- ✅ Protected endpoints show lock icons
- ✅ Try It Out works for all endpoints

## 📚 Documentation

- API Documentation: `http://localhost:9000/docs`
- Authentication Guide: `docs/swagger-authentication-guide.md`
- Setup completed and tested successfully!

---

**Status: ✅ READY FOR PRODUCTION**
