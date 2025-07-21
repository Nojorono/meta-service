import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAuthData1721552500000 implements MigrationInterface {
  name = 'SeedAuthData1721552500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert sample applications
    await queryRunner.query(`
      INSERT INTO auth_applications (app_code, app_name, app_description, app_url, status)
      VALUES 
        ('SOFIA', 'SOFIA System', 'SOFIA Warehouse Management System', 'http://localhost:3000', 'ACTIVE'),
        ('META-SERVICE', 'Meta Service API', 'SOFIA Meta Service REST API', 'http://localhost:9000', 'ACTIVE'),
        ('WMS', 'Warehouse Management', 'Warehouse Management System', 'http://localhost:8080', 'ACTIVE'),
        ('API-MGMT', 'API Management', 'API Management System', 'http://localhost:4000', 'ACTIVE')
    `);

    // Insert sample users (passwords are hashed with bcrypt)
    // Password for all sample users: "password123"
    await queryRunner.query(`
      INSERT INTO auth_users (username, email, password_hash, full_name, status)
      VALUES 
        ('admin', 'admin@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'System Administrator', 'ACTIVE'),
        ('api.user', 'api@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'API Integration User', 'ACTIVE'),
        ('readonly.user', 'readonly@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'Read Only User', 'ACTIVE'),
        ('sofia.admin', 'sofia.admin@company.com', '$2b$10$JMW1pkoYHEJhg2ueiv4KGuyxlmAgNLqaDty.9a/0hvv/lKWh5uJkS', 'SOFIA Administrator', 'ACTIVE')
    `);

    // Grant admin access to all applications
    await queryRunner.query(`
      INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
      SELECT 1, app_id, 'admin', '{"read": true, "write": true, "delete": true, "admin": true}'::jsonb, 'ACTIVE'
      FROM auth_applications
    `);

    // Grant API user access to META-SERVICE and API-MGMT
    await queryRunner.query(`
      INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
      SELECT 2, app_id, 'api', '{"read": true, "write": true, "delete": false}'::jsonb, 'ACTIVE'
      FROM auth_applications WHERE app_code IN ('META-SERVICE', 'API-MGMT')
    `);

    // Grant readonly user access to SOFIA only
    await queryRunner.query(`
      INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
      SELECT 3, app_id, 'readonly', '{"read": true, "write": false, "delete": false}'::jsonb, 'ACTIVE'
      FROM auth_applications WHERE app_code = 'SOFIA'
    `);

    // Grant SOFIA admin access to SOFIA, WMS, and META-SERVICE
    await queryRunner.query(`
      INSERT INTO auth_user_applications (user_id, app_id, role, permissions, status)
      SELECT 4, app_id, 'admin', '{"read": true, "write": true, "delete": true, "admin": true}'::jsonb, 'ACTIVE'
      FROM auth_applications WHERE app_code IN ('SOFIA', 'WMS', 'META-SERVICE')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove user applications
    await queryRunner.query(`DELETE FROM auth_user_applications`);

    // Remove users
    await queryRunner.query(`DELETE FROM auth_users`);

    // Remove applications
    await queryRunner.query(`DELETE FROM auth_applications`);
  }
}
