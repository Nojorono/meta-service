# Auth System TypeORM Migration Guide

This guide explains how to migrate from the raw SQL PostgreSQL setup to TypeORM entities for the authentication system.

## Overview

The authentication system has been migrated from raw SQL queries to TypeORM entities and repositories. This provides better type safety, relationship management, and integration with NestJS.

## Key Changes

### 1. Database Entities

- **AuthApplication**: Manages applications that can be accessed
- **AuthUser**: User accounts with authentication credentials
- **AuthUserApplication**: Junction table managing user-application access with roles and permissions

### 2. TypeORM Configuration

- **typeOrmConfig**: Main TypeORM configuration for NestJS
- **typeorm.datasource.ts**: DataSource configuration for CLI operations

### 3. Migration Files

- **CreateAuthTables**: Creates the auth tables structure
- **SeedAuthData**: Seeds initial data (applications and users)

## How to Use

### 1. Install Dependencies

Make sure you have TypeORM installed:

```bash
yarn add @nestjs/typeorm typeorm pg
yarn add -D @types/pg ts-node tsconfig-paths
```

### 2. Environment Variables

Set the following environment variables in your `.env` file:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=api_mgmt_user
POSTGRES_PASSWORD=api_mgmt_password
POSTGRES_DB=api_mgmt
```

### 3. Run Migrations

Build the application first:

```bash
yarn build
```

Then run the migrations:

```bash
yarn typeorm:migration:run
```

### 4. Verify Migration

Check that the tables were created and data was seeded:

```bash
# Connect to PostgreSQL
psql -h localhost -U api_mgmt_user -d api_mgmt

# Check tables
\dt

# Check data
SELECT * FROM auth_applications;
SELECT * FROM auth_users;
SELECT * FROM auth_user_applications;
```

## Default Users

The migration creates these default users (all with password "password123"):

| Username      | Email                   | Role     | Applications             |
| ------------- | ----------------------- | -------- | ------------------------ |
| admin         | admin@company.com       | admin    | All applications         |
| api.user      | api@company.com         | api      | META-SERVICE, API-MGMT   |
| readonly.user | readonly@company.com    | readonly | SOFIA                    |
| sofia.admin   | sofia.admin@company.com | admin    | SOFIA, WMS, META-SERVICE |

## Entity Relationships

```typescript
AuthUser 1 ---- * AuthUserApplication * ---- 1 AuthApplication
```

- One user can have access to multiple applications
- One application can be accessed by multiple users
- Each user-application relationship has specific role and permissions

## Service Changes

The `AuthService` now uses TypeORM repositories instead of raw SQL:

- `userRepository.findOne()` instead of `postgresService.executeQuery()`
- Automatic relation loading with `relations: ['userApplications', 'userApplications.application']`
- Type-safe entity operations

## Benefits

1. **Type Safety**: Full TypeScript support with entity definitions
2. **Relationship Management**: Automatic handling of foreign keys and joins
3. **Query Builder**: More readable and maintainable queries
4. **Migration System**: Version-controlled database schema changes
5. **Development Tools**: Better debugging and development experience

## Rolling Back

If you need to revert to the old SQL setup:

1. Run the migration rollback:

```bash
yarn typeorm:migration:revert
```

2. Restore the PostgreSQL service in the auth module
3. Revert the auth service to use raw SQL queries

## Generating New Migrations

To generate new migrations based on entity changes:

```bash
yarn typeorm:migration:generate src/database/migrations/NewMigrationName
```

## Troubleshooting

### Migration Fails

- Ensure PostgreSQL is running and accessible
- Check environment variables are correct
- Verify database exists and user has proper permissions

### Entities Not Found

- Make sure entities are imported in `typeorm.config.ts`
- Check that the auth module imports `TypeOrmModule.forFeature()`

### Connection Issues

- Verify PostgreSQL connection settings
- Check that the database user has CREATE/DROP privileges
