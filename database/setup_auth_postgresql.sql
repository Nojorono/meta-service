-- Generic Authentication System for PostgreSQL
-- Multi-Application Support with User-Application Access Control
-- Database: api_mgmt

-- Connect to api_mgmt database
\c api_mgmt;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS auth_user_applications CASCADE;
DROP TABLE IF EXISTS auth_users CASCADE;
DROP TABLE IF EXISTS auth_applications CASCADE;

-- 1. Create Applications Table
CREATE TABLE auth_applications (
    app_id SERIAL PRIMARY KEY,
    app_code VARCHAR(50) UNIQUE NOT NULL,
    app_name VARCHAR(100) NOT NULL,
    app_description TEXT,
    app_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- 2. Create Users Table  
CREATE TABLE auth_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_date TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- 3. Create User-Application Access Table (Many-to-Many)
CREATE TABLE auth_user_applications (
    user_app_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_users(user_id) ON DELETE CASCADE,
    app_id INTEGER NOT NULL REFERENCES auth_applications(app_id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    permissions JSONB, -- JSON format: {"read": true, "write": false, "delete": false}
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    granted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_date TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    UNIQUE(user_id, app_id)
);

-- Create function to update updated_date automatically
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_date
CREATE TRIGGER update_auth_applications_updated_date 
    BEFORE UPDATE ON auth_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_auth_users_updated_date 
    BEFORE UPDATE ON auth_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_auth_user_applications_updated_date 
    BEFORE UPDATE ON auth_user_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

-- Create indexes for performance
CREATE INDEX idx_auth_users_username ON auth_users(username);
CREATE INDEX idx_auth_users_email ON auth_users(email);
CREATE INDEX idx_auth_users_status ON auth_users(status);

CREATE INDEX idx_auth_apps_code ON auth_applications(app_code);
CREATE INDEX idx_auth_apps_status ON auth_applications(status);

CREATE INDEX idx_user_apps_user_id ON auth_user_applications(user_id);
CREATE INDEX idx_user_apps_app_id ON auth_user_applications(app_id);
CREATE INDEX idx_user_apps_status ON auth_user_applications(status);
CREATE INDEX idx_user_apps_permissions ON auth_user_applications USING GIN(permissions);

-- Insert sample applications
INSERT INTO auth_applications (app_code, app_name, app_description, app_url, status)
VALUES 
    ('SOFIA', 'SOFIA System', 'SOFIA Warehouse Management System', 'http://localhost:3000', 'ACTIVE'),
    ('META-SERVICE', 'Meta Service API', 'SOFIA Meta Service REST API', 'http://localhost:9000', 'ACTIVE'),
    ('WMS', 'Warehouse Management', 'Warehouse Management System', 'http://localhost:8080', 'ACTIVE'),
    ('API-MGMT', 'API Management', 'API Management System', 'http://localhost:4000', 'ACTIVE');

-- Insert sample users (passwords are hashed with bcrypt)
-- Password for all sample users: "password123"
INSERT INTO auth_users (username, email, password_hash, full_name, status)
VALUES 
    ('admin', 'admin@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'System Administrator', 'ACTIVE'),
    ('api.user', 'api@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'API Integration User', 'ACTIVE'),
    ('readonly.user', 'readonly@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'Read Only User', 'ACTIVE'),
    ('sofia.admin', 'sofia.admin@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'SOFIA Administrator', 'ACTIVE');

-- Grant admin access to all applications
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 1, app_id, 'admin', '{"read": true, "write": true, "delete": true, "admin": true}'::jsonb, 'ACTIVE'
FROM auth_applications;

-- Grant API user access to META-SERVICE and API-MGMT
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 2, app_id, 'api', '{"read": true, "write": true, "delete": false}'::jsonb, 'ACTIVE'
FROM auth_applications WHERE app_code IN ('META-SERVICE', 'API-MGMT');

-- Grant readonly user access to SOFIA only
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 3, app_id, 'readonly', '{"read": true, "write": false, "delete": false}'::jsonb, 'ACTIVE'
FROM auth_applications WHERE app_code = 'SOFIA';

-- Grant SOFIA admin access to SOFIA, WMS, and META-SERVICE
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 4, app_id, 'admin', '{"read": true, "write": true, "delete": true, "admin": true}'::jsonb, 'ACTIVE'
FROM auth_applications WHERE app_code IN ('SOFIA', 'WMS', 'META-SERVICE');

-- Create views for easier querying
CREATE VIEW user_application_access AS
SELECT 
    u.user_id,
    u.username,
    u.email,
    u.full_name,
    u.status as user_status,
    a.app_id,
    a.app_code,
    a.app_name,
    a.app_description,
    ua.role,
    ua.permissions,
    ua.status as access_status,
    ua.granted_date,
    ua.expires_date
FROM auth_users u
JOIN auth_user_applications ua ON u.user_id = ua.user_id
JOIN auth_applications a ON ua.app_id = a.app_id
WHERE u.status = 'ACTIVE' AND ua.status = 'ACTIVE' AND a.status = 'ACTIVE';

-- Show created data
SELECT 'Applications:' as info;
SELECT app_id, app_code, app_name, status, created_date
FROM auth_applications
ORDER BY app_id;

SELECT 'Users:' as info;
SELECT user_id, username, full_name, status, created_date
FROM auth_users
ORDER BY user_id;

SELECT 'User-Application Access:' as info;
SELECT username, app_code, role, permissions, access_status
FROM user_application_access
ORDER BY username, app_code;

-- Show table sizes
SELECT 'Table Statistics:' as info;
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals
FROM pg_stats 
WHERE schemaname = 'public' AND tablename LIKE 'auth_%'
ORDER BY schemaname, tablename, attname;
