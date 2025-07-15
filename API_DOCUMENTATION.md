# SOFIA Meta Service - API Documentation

## Overview
SOFIA Meta Service menyediakan API untuk mengakses data master dari Oracle Database melalui REST API yang didokumentasikan dengan Swagger.

## Base URL
- **Development**: `http://localhost:9000`
- **API Version**: `v1`
- **Global Prefix**: `/api`

## Swagger Documentation
- **URL**: `http://localhost:9000/docs`
- **Features**: 
  - Interactive API testing
  - Real-time request/response examples
  - JWT Bearer token authentication
  - Detailed parameter descriptions

## API Endpoints

### 1. Customer Meta APIs

#### Get All Customers
```http
GET /api/v1/customer
```
**Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: all)
- `search` (optional): Search term for filtering customers

**Example:**
```http
GET /api/v1/customer?page=1&limit=10&search=PT
```

#### Get Customers by Date
```http
GET /api/v1/customer/by-date?last_update_date=2024-01-15
```

#### Get Customer by ID
```http
GET /api/v1/customer/{id}
```

### 2. Branch Meta APIs

#### Get All Branches
```http
GET /api/v1/branch
```

#### Get Branches by Date
```http
GET /api/v1/branch/by-date?last_update_date=2024-01-15
```

### 3. Region Meta APIs

#### Get All Regions
```http
GET /api/v1/region
```

#### Get Regions by Date
```http
GET /api/v1/region/by-date?last_update_date=2024-01-15
```

#### Get Region by Code
```http
GET /api/v1/region/{code}
```

### 4. Employee Meta APIs

#### Get All Employees
```http
GET /api/v1/employee
```

#### Get Employees by Date
```http
GET /api/v1/employee/by-date?last_update_date=2024-01-15
```

#### Get Employee by Number
```http
GET /api/v1/employee/{employeeNumber}
```

### 5. GeoTree Meta APIs

#### Get All GeoTrees
```http
GET /api/v1/geotree
```

#### Get GeoTrees by Date
```http
GET /api/v1/geotree/by-date?last_update_date=2024-01-15
```

## Response Format

All APIs return data in the following format:

```json
{
  "statusCode": 200,
  "message": "OK",
  "data": {
    "data": [...],
    "count": 100,
    "status": true,
    "message": "Data retrieved successfully from Oracle",
    "totalPages": 10,
    "currentPage": 1,
    "limit": 10
  }
}
```

## Error Handling

Error responses follow this format:

```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "data": {
    "data": [],
    "count": 0,
    "status": false,
    "message": "Error message details"
  }
}
```

## Testing with Swagger

### 1. Start the Service
```bash
cd d:\kerjaan\SOFIA\service-meta
yarn dev
```

### 2. Open Swagger UI
Navigate to: `http://localhost:9000/docs`

### 3. Testing Steps
1. **Select API endpoint** from the list
2. **Click "Try it out"** button
3. **Enter parameters** if required
4. **Click "Execute"** to test
5. **Review response** in the Response section

### 4. Features Available in Swagger
- **Real-time testing**: Execute APIs directly from browser
- **Parameter validation**: Automatic validation of required fields
- **Response examples**: See actual response structure
- **Error handling**: View error responses
- **Authentication**: JWT Bearer token support (if needed)

## Data Sources

All APIs fetch data from Oracle Database views:
- **Customers**: `APPS.XTD_AR_CUSTOMERS_V`
- **Branches**: `APPS.XTD_INV_BRANCHES_V`
- **Regions**: `APPS.XTD_INV_REGION_V`
- **Employees**: `APPS.XTD_HR_EMPLOYEES_V`
- **GeoTrees**: `APPS.XTD_INV_GEOTREE_V`

## Caching

- **Cache Provider**: Redis
- **Cache TTL**: 1 hour
- **Cache Keys**: Based on endpoint and parameters
- **Cache Invalidation**: Automatic after TTL expires

## Authentication

Currently, all endpoints are marked as `@Public()` for testing purposes. In production, JWT authentication will be required.

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting for production use.

## Monitoring

- **Health Check**: `GET /health`
- **Service Status**: `GET /`
- **Logs**: Available in console output

## Troubleshooting

### Common Issues:

1. **Oracle Connection Error**
   - Check database connectivity
   - Verify Oracle Instant Client installation
   - Ensure proper environment variables

2. **Service Not Starting**
   - Check port 9000 availability
   - Verify dependencies installation
   - Review environment configuration

3. **Empty Response**
   - Check Oracle database data
   - Verify table permissions
   - Review service logs

### Debug Mode:
```bash
yarn debug
```

## Production Considerations

Before deploying to production:

1. **Enable Authentication**: Remove `@Public()` decorators
2. **Add Rate Limiting**: Implement API rate limiting
3. **Error Handling**: Enhance error responses
4. **Logging**: Add structured logging
5. **Monitoring**: Add metrics and monitoring
6. **Security**: Implement proper security headers
7. **Validation**: Add input validation
8. **Documentation**: Update API documentation
