# PostgreSQL Setup Guide for SOFIA Meta Service

## 1. Install PostgreSQL

### Windows (using PowerShell as Administrator):

```powershell
# Using Chocolatey (recommended)
choco install postgresql

# Or download from official site: https://www.postgresql.org/download/windows/
```

### Alternative - Using Docker:

```powershell
# Run PostgreSQL in Docker
docker run --name sofia-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=api_mgmt -p 5432:5432 -d postgres:15

# Or create docker-compose.yml for persistent setup
```

## 2. Start PostgreSQL Service

### Windows Service:

```powershell
# Start PostgreSQL service
net start postgresql-x64-15  # Version number may vary

# Or using Services.msc GUI
```

### Docker:

```powershell
docker start sofia-postgres
```

## 3. Create Database and User

Connect to PostgreSQL as superuser and run:

```sql
-- Connect as postgres user first
psql -U postgres

-- Create database
CREATE DATABASE api_mgmt;

-- Create user
CREATE USER api_mgmt WITH PASSWORD '@p1-mGmNt';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE api_mgmt TO api_mgmt;

-- Connect to the database
\c api_mgmt

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO api_mgmt;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO api_mgmt;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO api_mgmt;

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q
```

## 4. Setup Authentication Tables

Run the setup script:

```powershell
cd "d:\kerjaan\SOFIA\service-meta"
psql -h localhost -U api_mgmt -d api_mgmt -f database/setup_auth_postgresql.sql
```

## 5. Test Connection

```powershell
node scripts/test-postgresql.js
```

## 6. Start SOFIA Meta Service

```powershell
yarn dev
```

## Docker Compose Setup (Alternative)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: sofia-postgres
    environment:
      POSTGRES_DB: api_mgmt
      POSTGRES_USER: api_mgmt
      POSTGRES_PASSWORD: '@p1-mGmNt'
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/setup_auth_postgresql.sql:/docker-entrypoint-initdb.d/01-setup.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

Then run:

```powershell
docker-compose up -d
```

## Environment Variables

Make sure your `.env.local` has:

```
PSQL_HOST=localhost
PSQL_PORT=5432
PSQL_NAME=api_mgmt
PSQL_USER=api_mgmt
PSQL_PASSWORD=@p1-mGmNt
```

## Troubleshooting

1. **Connection Refused**: PostgreSQL service not running

   - Windows: `net start postgresql-x64-15`
   - Docker: `docker start sofia-postgres`

2. **Authentication Failed**: Check username/password

   - Verify `.env.local` settings
   - Reset password: `ALTER USER api_mgmt PASSWORD '@p1-mGmNt';`

3. **Database Not Found**: Create database first

   - Run the database creation commands above

4. **Permission Denied**: Grant proper privileges
   - Run the GRANT commands above as postgres superuser
