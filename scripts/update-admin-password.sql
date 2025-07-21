UPDATE auth_users SET password_hash = '$2b$10$.3RhGKPDA.1r5TfmMEQ7fu/6QC5o127LIAWc6flGm3YRbaWiQZhSu' WHERE username = 'admin';
SELECT 'Password updated for admin user' as result;
