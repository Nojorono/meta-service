#!/bin/bash
# SOFIA Meta Service - WSL Ubuntu PostgreSQL Setup Script

echo "🐧 SOFIA Meta Service - PostgreSQL Setup for WSL Ubuntu"
echo "======================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo -e "${BLUE}🔍 Checking PostgreSQL installation...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL not installed${NC}"
    echo -e "${CYAN}📥 Installing PostgreSQL...${NC}"
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    echo -e "${GREEN}✅ PostgreSQL installed${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL is already installed${NC}"
fi

# Start PostgreSQL service
echo -e "${BLUE}🚀 Starting PostgreSQL service...${NC}"
sudo service postgresql start
sleep 2

# Check service status
if sudo service postgresql status | grep -q "is running"; then
    echo -e "${GREEN}✅ PostgreSQL service is running${NC}"
else
    echo -e "${RED}❌ Failed to start PostgreSQL service${NC}"
    exit 1
fi

# Create database and user
echo -e "${BLUE}🗃️  Setting up database and user...${NC}"
sudo -u postgres psql << 'EOF'
-- Create database if not exists
SELECT 'CREATE DATABASE api_mgmt'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'api_mgmt')\gexec

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'api_mgmt') THEN
        CREATE USER api_mgmt WITH PASSWORD '@p1-mGmNt';
    END IF;
END
$$;

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
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database and user created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create database and user${NC}"
    exit 1
fi

# Configure PostgreSQL to accept Windows connections
echo -e "${BLUE}🔧 Configuring PostgreSQL for Windows access...${NC}"

# Find PostgreSQL config directory
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
CONFIG_DIR="/etc/postgresql/$PG_VERSION/main"

if [ ! -d "$CONFIG_DIR" ]; then
    CONFIG_DIR=$(sudo find /etc/postgresql -name "postgresql.conf" -exec dirname {} \; | head -1)
fi

if [ -z "$CONFIG_DIR" ]; then
    echo -e "${RED}❌ Could not find PostgreSQL config directory${NC}"
    exit 1
fi

echo -e "${CYAN}📁 Config directory: $CONFIG_DIR${NC}"

# Backup original configs
sudo cp "$CONFIG_DIR/postgresql.conf" "$CONFIG_DIR/postgresql.conf.backup"
sudo cp "$CONFIG_DIR/pg_hba.conf" "$CONFIG_DIR/pg_hba.conf.backup"

# Update postgresql.conf to listen on all addresses
echo -e "${BLUE}📝 Updating postgresql.conf...${NC}"
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$CONFIG_DIR/postgresql.conf"

# Update pg_hba.conf to allow Windows connections
echo -e "${BLUE}📝 Updating pg_hba.conf...${NC}"
if ! sudo grep -q "host.*all.*all.*172\..*md5" "$CONFIG_DIR/pg_hba.conf"; then
    echo "# Allow Windows WSL connections" | sudo tee -a "$CONFIG_DIR/pg_hba.conf"
    echo "host    all             all             172.0.0.0/8             md5" | sudo tee -a "$CONFIG_DIR/pg_hba.conf"
fi

# Restart PostgreSQL to apply changes
echo -e "${BLUE}🔄 Restarting PostgreSQL...${NC}"
sudo service postgresql restart
sleep 3

# Check if service is still running
if sudo service postgresql status | grep -q "is running"; then
    echo -e "${GREEN}✅ PostgreSQL restarted successfully${NC}"
else
    echo -e "${RED}❌ PostgreSQL failed to restart${NC}"
    exit 1
fi

# Test local connection
echo -e "${BLUE}🧪 Testing local connection...${NC}"
if sudo -u api_mgmt psql -d api_mgmt -c "SELECT 'Connection successful!' as test;" &>/dev/null; then
    echo -e "${GREEN}✅ Local connection test passed${NC}"
else
    echo -e "${RED}❌ Local connection test failed${NC}"
fi

# Show connection info
echo -e "${CYAN}"
echo "🎉 PostgreSQL setup completed!"
echo "================================"
echo -e "${NC}"
echo -e "${GREEN}📋 Connection Details:${NC}"
echo "   Host: $(hostname -I | awk '{print $1}')"
echo "   Port: 5432"
echo "   Database: api_mgmt"
echo "   User: api_mgmt"
echo "   Password: @p1-mGmNt"
echo ""
echo -e "${GREEN}🔧 Service Management:${NC}"
echo "   Start:  sudo service postgresql start"
echo "   Stop:   sudo service postgresql stop"
echo "   Status: sudo service postgresql status"
echo ""
echo -e "${GREEN}📝 Next Steps:${NC}"
echo "1. Update Windows .env.local with WSL IP address"
echo "2. Run authentication setup script from Windows"
echo "3. Test connection from SOFIA Meta Service"
echo ""
echo -e "${YELLOW}💡 WSL IP Address: $(hostname -I | awk '{print $1}')${NC}"
