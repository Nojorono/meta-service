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
- `GET /api/v1/customer`
- `GET /api/v1/customer/by-date`
- `GET /api/v1/customer/{id}`

### 2. Branch Meta APIs
- `GET /api/v1/branch`
- `GET /api/v1/branch/by-date`
- `GET /api/v1/branch/{id}`

### 3. Region Meta APIs
- `GET /api/v1/region`
- `GET /api/v1/region/by-date`
- `GET /api/v1/region/{code}`

### 4. Employee Meta APIs
- `GET /api/v1/employee`
- `GET /api/v1/employee/by-date`
- `GET /api/v1/employee/{employeeNumber}`

### 5. GeoTree Meta APIs
- `GET /api/v1/geotree`
- `GET /api/v1/geotree/by-date`
- `GET /api/v1/geotree/{id}`

### 6. Warehouse Meta APIs
- `GET /api/v1/warehouse`
- `GET /api/v1/warehouse/by-date`
- `GET /api/v1/warehouse/organization-code?organization_code=SUB`
- `GET /api/v1/warehouse/{id}`

### 7. Item List APIs
- `GET /api/v1/item-list`
- `GET /api/v1/item-list/by-item-code`

### 8. Sales Item APIs
- `GET /api/v1/sales-item`
- `GET /api/v1/sales-item/by-date`

### 9. Salesman APIs
- `GET /api/v1/salesman`
- `GET /api/v1/salesman/{id}`

### 10. Province APIs
- `GET /api/v1/province`
- `GET /api/v1/province/{code}`

### 11. City APIs
- `GET /api/v1/city`
- `GET /api/v1/city/{code}`

### 12. District APIs
- `GET /api/v1/district`
- `GET /api/v1/district/{code}`

### 13. Sub-district APIs
- `GET /api/v1/subdistrict`
- `GET /api/v1/subdistrict/{code}`

### 14. Organization APIs
- `GET /api/v1/organization`
- `GET /api/v1/organization/{id}`

### 15. Position APIs
- `GET /api/v1/position`
- `GET /api/v1/position/{id}`

### 16. Supplier APIs
- `GET /api/v1/supplier`
- `GET /api/v1/supplier/{id}`

### 17. Category APIs
- `GET /api/v1/category`
- `GET /api/v1/category/{id}`

### 18. Purchase Order APIs
- `GET /api/v1/purchase-order?nomorPO={nomorPO}`

### 19. Sales Order Stock APIs
- `GET /api/v1/sales-order-stock`
- `GET /api/v1/sales-order-stock/{id}`

### 20. AR Outstandings APIs
- `GET /api/v1/ar-outstandings`
- `GET /api/v1/ar-outstandings/{id}`

### 21. AR Terms APIs
- `GET /api/v1/ar-terms`
- `GET /api/v1/ar-terms/{id}`

### 22. AP Terms APIs
- `GET /api/v1/ap-terms`
- `GET /api/v1/ap-terms/{id}`

### 23. AP Invoice Types APIs
- `GET /api/v1/ap-invoice-types`
- `GET /api/v1/ap-invoice-types/{id}`

### 24. ZxTax APIs
- `GET /api/v1/zx-tax`
- `GET /api/v1/zx-tax/{id}`

### 25. FPPR Types APIs
- `GET /api/v1/fppr-types`
- `GET /api/v1/fppr-types/{code}`

### 26. FPPR Sales Types APIs
- `GET /api/v1/fppr-sales-types`
- `GET /api/v1/fppr-sales-types/{code}`

### 27. Price List APIs
- `GET /api/v1/price-list`
- `GET /api/v1/price-list/{id}`

### 28. Payment Method APIs
- `GET /api/v1/payment-method`
- `GET /api/v1/payment-method/name/{name}`
- `GET /api/v1/payment-method/code/{code}`

### 29. Receipt Method APIs
- `GET /api/v1/receipt-method`
- `GET /api/v1/receipt-method/{id}`

### 30. Currency APIs
- `GET /api/v1/currency`
- `GET /api/v1/currency/{code}`

### 31. Transaction Type APIs
- `GET /api/v1/transaction-type`
- `GET /api/v1/transaction-type/{code}`

### 32. COA Expense APIs
- `GET /api/v1/coa-expense`
- `GET /api/v1/coa-expense/{id}`

### 33. User DMS APIs
- `GET /api/v1/user-dms`
- `GET /api/v1/user-dms/{id}`

### 34. Sales Item Conversion APIs
- `GET /api/v1/sales-item-conversion`
- `GET /api/v1/sales-item-conversion/{id}`

### 35. Sales Activity APIs
- `GET /api/v1/sales-activity`
- `GET /api/v1/sales-activity/{id}`

### 36. Sales Order Types APIs
- `GET /api/v1/sales-order-types`
- `GET /api/v1/sales-order-types/{id}`

### 37. Mtl Trx Lists APIs
- `GET /api/v1/mtl-trx-lists`
- `GET /api/v1/mtl-trx-lists/{id}`

### 38. Summary FPPR APIs
- `GET /api/v1/summary-fppr`
- `GET /api/v1/summary-fppr/{id}`

### 39. Inventory On Hand Quantity APIs
- `GET /api/v1/inv-on-hand-qty` - Get all inventory data
- `GET /api/v1/inv-on-hand-qty?item_code={itemCode}` - Filter by item code
- `GET /api/v1/inv-on-hand-qty?subinventory_code={subinventoryCode}` - Filter by subinventory code
- `GET /api/v1/inv-on-hand-qty?item_code={itemCode}&subinventory_code={subinventoryCode}` - Filter by both parameters

---

**Catatan:**
- Semua endpoint mendukung query parameter untuk filter, pagination, dan pencarian sesuai dokumentasi Swagger.
- Untuk detail parameter dan response, cek Swagger UI di `/docs`.

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
- **Employees**: `APPS.XTD_HR_EMPLOYEES_V` and `APPS.XTD_PAPF_EMPLOYEE_V`
- **GeoTrees**: `APPS.XTD_INV_GEOTREE_V`
- **Warehouses**: `APPS.XTD_INV_WAREHOUSES_V`
- **Sales Items**: `APPS.XTD_INV_SALES_ITEMS_V`
- **Salesmen**: `APPS.XTD_ONT_SALESREPS_V`
- **Provinces**: `APPS.XTD_FND_PROVINSI_V`
- **Cities**: `APPS.XTD_FND_KOTAMADYA_V`
- **Districts**: `APPS.XTD_FND_KECAMATAN_V`
- **Sub-districts**: `APPS.XTD_FND_KELURAHAN_V`
- **Organizations**: `APPS.XTD_HR_ORGANIZATIONS_V`
- **Positions**: `APPS.XTD_HR_POSITIONS_V`
- **Suppliers**: `APPS.XTD_AP_SUPPLIERS_V`
- **Categories**: `APPS.XTD_INV_CATEGORIES_V`
- **Inventory On Hand Quantity**: `XTD_INV_ON_HAND_QTY_V` with `APPS.XTD_INV_SALES_ITEM_CONVERSIONS_V`

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
