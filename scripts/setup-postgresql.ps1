# SOFIA Meta Service - PostgreSQL Quick Setup Script

Write-Host "🚀 SOFIA Meta Service - PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  This script should be run as Administrator for service management" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

Write-Host "🔍 Checking system requirements..." -ForegroundColor Green

# Check for PostgreSQL
$pgInstalled = Test-Command "psql"
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($pgInstalled -and $pgService) {
    Write-Host "✅ PostgreSQL is installed" -ForegroundColor Green
    
    # Check if service is running
    $runningServices = $pgService | Where-Object { $_.Status -eq "Running" }
    if ($runningServices.Count -gt 0) {
        Write-Host "✅ PostgreSQL service is running: $($runningServices[0].Name)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL service is not running" -ForegroundColor Yellow
        
        if ($isAdmin) {
            Write-Host "🔄 Starting PostgreSQL service..." -ForegroundColor Blue
            try {
                Start-Service $pgService[0].Name
                Write-Host "✅ PostgreSQL service started" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to start PostgreSQL service: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "   Please run as Administrator to start the service" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ PostgreSQL not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installation options:" -ForegroundColor Cyan
    Write-Host "1. Using Chocolatey (recommended):" -ForegroundColor White
    Write-Host "   choco install postgresql" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Download from official site:" -ForegroundColor White
    Write-Host "   https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Using Docker:" -ForegroundColor White
    Write-Host "   docker run --name sofia-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=api_mgmt -p 5432:5432 -d postgres:15" -ForegroundColor Gray
    
    $choice = Read-Host "`n🤔 Would you like to install PostgreSQL using Chocolatey? (y/n)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        if (Test-Command "choco") {
            Write-Host "📦 Installing PostgreSQL..." -ForegroundColor Blue
            choco install postgresql -y
        } else {
            Write-Host "❌ Chocolatey not found. Please install manually." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Please install PostgreSQL manually and run this script again." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Setting up database and user..." -ForegroundColor Green

# Create setup SQL script for database and user
$setupSql = @"
-- Create database if not exists
SELECT 'CREATE DATABASE api_mgmt'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'api_mgmt')\gexec

-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'api_mgmt') THEN
        CREATE USER api_mgmt WITH PASSWORD '@p1-mGmNt';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE api_mgmt TO api_mgmt;

-- Connect to api_mgmt database
\c api_mgmt

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO api_mgmt;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO api_mgmt;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO api_mgmt;

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q
"@

$setupSql | Out-File -FilePath "setup_temp.sql" -Encoding UTF8

Write-Host "🗃️  Creating database and user..." -ForegroundColor Blue

try {
    # Try to connect as postgres user
    $env:PGPASSWORD = "postgres"
    psql -U postgres -f setup_temp.sql 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database and user created successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not connect as 'postgres' user. Trying alternative setup..." -ForegroundColor Yellow
        
        # Alternative: try to connect without specifying user (might work for some installations)
        psql -f setup_temp.sql 2>$null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Could not set up database automatically." -ForegroundColor Red
            Write-Host "   Please run the following commands manually in PostgreSQL:" -ForegroundColor Yellow
            Write-Host "   1. psql -U postgres" -ForegroundColor Gray
            Write-Host "   2. CREATE DATABASE api_mgmt;" -ForegroundColor Gray
            Write-Host "   3. CREATE USER api_mgmt WITH PASSWORD '@p1-mGmNt';" -ForegroundColor Gray
            Write-Host "   4. GRANT ALL PRIVILEGES ON DATABASE api_mgmt TO api_mgmt;" -ForegroundColor Gray
        }
    }
} finally {
    Remove-Item "setup_temp.sql" -ErrorAction SilentlyContinue
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "🗂️  Setting up authentication tables..." -ForegroundColor Green

# Check if setup script exists
if (Test-Path "database\setup_auth_postgresql.sql") {
    Write-Host "📄 Running authentication setup script..." -ForegroundColor Blue
    
    $env:PGPASSWORD = "@p1-mGmNt"
    psql -h localhost -U api_mgmt -d api_mgmt -f "database\setup_auth_postgresql.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Authentication tables created successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Error setting up authentication tables" -ForegroundColor Yellow
    }
    
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
} else {
    Write-Host "❌ Authentication setup script not found at: database\setup_auth_postgresql.sql" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Testing connection..." -ForegroundColor Green

if (Test-Path "scripts\test-postgresql.js") {
    node scripts\test-postgresql.js
} else {
    Write-Host "⚠️  Connection test script not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 PostgreSQL setup completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor White
Write-Host "1. Verify connection test above passed" -ForegroundColor Gray
Write-Host "2. Start the SOFIA Meta Service: yarn dev" -ForegroundColor Gray
Write-Host "3. Test authentication endpoints" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Troubleshooting:" -ForegroundColor White
Write-Host "- Check docs\postgresql-setup.md for detailed instructions" -ForegroundColor Gray
Write-Host "- Verify .env.local has correct PostgreSQL settings" -ForegroundColor Gray
