-- SOFIA Authentication Users Table
-- This script creates the users table for JWT authentication

-- Create the users table
CREATE TABLE sofia_users (
    user_id NUMBER(10) PRIMARY KEY,
    username VARCHAR2(100) UNIQUE NOT NULL,
    email VARCHAR2(255),
    password_hash VARCHAR2(255) NOT NULL,
    full_name VARCHAR2(200) NOT NULL,
    role VARCHAR2(50) DEFAULT 'user' NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_date DATE DEFAULT SYSDATE,
    updated_date DATE DEFAULT SYSDATE,
    last_login_date DATE,
    created_by NUMBER(10),
    updated_by NUMBER(10)
);

-- Create sequence for auto-increment user_id
CREATE SEQUENCE sofia_users_seq
    START WITH 1
    INCREMENT BY 1
    NOMAXVALUE
    NOCACHE;

-- Create trigger for auto-increment
CREATE OR REPLACE TRIGGER sofia_users_bi
    BEFORE INSERT ON sofia_users
    FOR EACH ROW
BEGIN
    IF :NEW.user_id IS NULL THEN
        :NEW.user_id := sofia_users_seq.NEXTVAL;
    END IF;
    :NEW.created_date := SYSDATE;
    :NEW.updated_date := SYSDATE;
END;
/

-- Create trigger for update timestamp
CREATE OR REPLACE TRIGGER sofia_users_bu
    BEFORE UPDATE ON sofia_users
    FOR EACH ROW
BEGIN
    :NEW.updated_date := SYSDATE;
END;
/

-- Create indexes for performance
CREATE INDEX idx_sofia_users_username ON sofia_users(username);
CREATE INDEX idx_sofia_users_email ON sofia_users(email);
CREATE INDEX idx_sofia_users_status ON sofia_users(status);

-- Insert sample users (passwords are hashed with bcrypt)
-- Password for all sample users: "password123"
INSERT INTO sofia_users (username, email, password_hash, full_name, role, status)
VALUES ('admin@sofia.com', 'admin@sofia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin', 'ACTIVE');

INSERT INTO sofia_users (username, email, password_hash, full_name, role, status)
VALUES ('api@sofia.com', 'api@sofia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'API User', 'api', 'ACTIVE');

INSERT INTO sofia_users (username, email, password_hash, full_name, role, status)
VALUES ('readonly@sofia.com', 'readonly@sofia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Read Only User', 'readonly', 'ACTIVE');

-- Commit the changes
COMMIT;

-- Show the created users
SELECT user_id, username, full_name, role, status, created_date 
FROM sofia_users 
ORDER BY user_id;
