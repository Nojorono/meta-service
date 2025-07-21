-- Generic Authentication System
-- Multi-Application Support with User-Application Access Control

-- 1. Create Applications Table
CREATE TABLE auth_applications (
    app_id NUMBER(10) PRIMARY KEY,
    app_code VARCHAR2(50) UNIQUE NOT NULL,
    app_name VARCHAR2(100) NOT NULL,
    app_description VARCHAR2(500),
    app_url VARCHAR2(255),
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    created_date DATE DEFAULT SYSDATE,
    updated_date DATE DEFAULT SYSDATE,
    created_by NUMBER(10),
    updated_by NUMBER(10)
);

-- 2. Create Users Table  
CREATE TABLE auth_users (
    user_id NUMBER(10) PRIMARY KEY,
    username VARCHAR2(100) UNIQUE NOT NULL,
    email VARCHAR2(255) UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    full_name VARCHAR2(200) NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_date DATE DEFAULT SYSDATE,
    updated_date DATE DEFAULT SYSDATE,
    last_login_date DATE,
    created_by NUMBER(10),
    updated_by NUMBER(10)
);

-- 3. Create User-Application Access Table (Many-to-Many)
CREATE TABLE auth_user_applications (
    user_app_id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) NOT NULL,
    app_id NUMBER(10) NOT NULL,
    role VARCHAR2(50) DEFAULT 'user' NOT NULL,
    permissions VARCHAR2(1000), -- JSON format: {"read": true, "write": false, "delete": false}
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    granted_date DATE DEFAULT SYSDATE,
    expires_date DATE,
    created_date DATE DEFAULT SYSDATE,
    updated_date DATE DEFAULT SYSDATE,
    created_by NUMBER(10),
    updated_by NUMBER(10),
    CONSTRAINT fk_user_app_user FOREIGN KEY (user_id) REFERENCES auth_users(user_id),
    CONSTRAINT fk_user_app_application FOREIGN KEY (app_id) REFERENCES auth_applications(app_id),
    CONSTRAINT uk_user_application UNIQUE (user_id, app_id)
);

-- Create sequences
CREATE SEQUENCE auth_applications_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE NOCACHE;
CREATE SEQUENCE auth_users_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE NOCACHE;
CREATE SEQUENCE auth_user_applications_seq START WITH 1 INCREMENT BY 1 NOMAXVALUE NOCACHE;

-- Create triggers for auth_applications
CREATE OR REPLACE TRIGGER auth_applications_bi
    BEFORE INSERT ON auth_applications
    FOR EACH ROW
BEGIN
    IF :NEW.app_id IS NULL THEN
        :NEW.app_id := auth_applications_seq.NEXTVAL;
    END IF;
    :NEW.created_date := SYSDATE;
    :NEW.updated_date := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER auth_applications_bu
    BEFORE UPDATE ON auth_applications
    FOR EACH ROW
BEGIN
    :NEW.updated_date := SYSDATE;
END;
/

-- Create triggers for auth_users
CREATE OR REPLACE TRIGGER auth_users_bi
    BEFORE INSERT ON auth_users
    FOR EACH ROW
BEGIN
    IF :NEW.user_id IS NULL THEN
        :NEW.user_id := auth_users_seq.NEXTVAL;
    END IF;
    :NEW.created_date := SYSDATE;
    :NEW.updated_date := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER auth_users_bu
    BEFORE UPDATE ON auth_users
    FOR EACH ROW
BEGIN
    :NEW.updated_date := SYSDATE;
END;
/

-- Create triggers for auth_user_applications
CREATE OR REPLACE TRIGGER auth_user_applications_bi
    BEFORE INSERT ON auth_user_applications
    FOR EACH ROW
BEGIN
    IF :NEW.user_app_id IS NULL THEN
        :NEW.user_app_id := auth_user_applications_seq.NEXTVAL;
    END IF;
    :NEW.created_date := SYSDATE;
    :NEW.updated_date := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER auth_user_applications_bu
    BEFORE UPDATE ON auth_user_applications
    FOR EACH ROW
BEGIN
    :NEW.updated_date := SYSDATE;
END;
/

-- Create indexes for performance
CREATE INDEX idx_auth_users_username ON auth_users(username);
CREATE INDEX idx_auth_users_email ON auth_users(email);
CREATE INDEX idx_auth_users_status ON auth_users(status);

CREATE INDEX idx_auth_apps_code ON auth_applications(app_code);
CREATE INDEX idx_auth_apps_status ON auth_applications(status);

CREATE INDEX idx_user_apps_user_id ON auth_user_applications(user_id);
CREATE INDEX idx_user_apps_app_id ON auth_user_applications(app_id);
CREATE INDEX idx_user_apps_status ON auth_user_applications(status);

-- Insert sample applications
INSERT INTO auth_applications (app_code, app_name, app_description, app_url, status)
VALUES ('SOFIA', 'SOFIA System', 'SOFIA Warehouse Management System', 'http://localhost:3000', 'ACTIVE');

INSERT INTO auth_applications (app_code, app_name, app_description, app_url, status)
VALUES ('META-SERVICE', 'Meta Service API', 'SOFIA Meta Service REST API', 'http://localhost:9000', 'ACTIVE');

INSERT INTO auth_applications (app_code, app_name, app_description, app_url, status)
VALUES ('WMS', 'Warehouse Management', 'Warehouse Management System', 'http://localhost:8080', 'ACTIVE');

-- Insert sample users (passwords are hashed with bcrypt)
-- Password for all sample users: "password123"
INSERT INTO auth_users (username, email, password_hash, full_name, status)
VALUES ('admin', 'admin@company.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'ACTIVE');

INSERT INTO auth_users (username, email, password_hash, full_name, status)
VALUES ('api.user', 'api@company.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'API Integration User', 'ACTIVE');

INSERT INTO auth_users (username, email, password_hash, full_name, status)
VALUES ('readonly.user', 'readonly@company.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Read Only User', 'ACTIVE');

-- Grant admin access to all applications
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 1, app_id, 'admin', '{"read": true, "write": true, "delete": true, "admin": true}', 'ACTIVE'
FROM auth_applications;

-- Grant API user access to META-SERVICE and WMS
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 2, app_id, 'api', '{"read": true, "write": true, "delete": false}', 'ACTIVE'
FROM auth_applications WHERE app_code IN ('META-SERVICE', 'WMS');

-- Grant readonly user access to SOFIA only
INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
SELECT 3, app_id, 'readonly', '{"read": true, "write": false, "delete": false}', 'ACTIVE'
FROM auth_applications WHERE app_code = 'SOFIA';

-- Commit the changes
COMMIT;

-- Show created data
SELECT 'Applications:' as info FROM dual;
SELECT app_id, app_code, app_name, status, created_date
FROM auth_applications
ORDER BY app_id;

SELECT 'Users:' as info FROM dual;
SELECT user_id, username, full_name, status, created_date
FROM auth_users
ORDER BY user_id;

SELECT 'User-Application Access:' as info FROM dual;
SELECT ua.user_app_id, u.username, a.app_code, ua.role, ua.permissions, ua.status
FROM auth_user_applications ua
JOIN auth_users u ON ua.user_id = u.user_id
JOIN auth_applications a ON ua.app_id = a.app_id
ORDER BY u.username, a.app_code;
