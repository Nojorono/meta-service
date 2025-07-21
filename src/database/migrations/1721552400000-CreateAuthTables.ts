import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTables1721552400000 implements MigrationInterface {
  name = 'CreateAuthTables1721552400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create auth_applications table
    await queryRunner.query(`
      CREATE TABLE "auth_applications" (
        "app_id" SERIAL NOT NULL,
        "app_code" character varying(50) NOT NULL,
        "app_name" character varying(100) NOT NULL,
        "app_description" text,
        "app_url" character varying(255),
        "status" character varying NOT NULL DEFAULT 'ACTIVE',
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "UQ_auth_applications_app_code" UNIQUE ("app_code"),
        CONSTRAINT "PK_auth_applications" PRIMARY KEY ("app_id"),
        CONSTRAINT "CHK_auth_applications_status" CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE'))
      )
    `);

    // Create auth_users table
    await queryRunner.query(`
      CREATE TABLE "auth_users" (
        "user_id" SERIAL NOT NULL,
        "username" character varying(100) NOT NULL,
        "email" character varying(255),
        "password_hash" character varying(255) NOT NULL,
        "full_name" character varying(200) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'ACTIVE',
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
        "last_login_date" TIMESTAMP,
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "UQ_auth_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_auth_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_auth_users" PRIMARY KEY ("user_id"),
        CONSTRAINT "CHK_auth_users_status" CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
      )
    `);

    // Create auth_user_applications table
    await queryRunner.query(`
      CREATE TABLE "auth_user_applications" (
        "user_app_id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "app_id" integer NOT NULL,
        "role" character varying(50) NOT NULL DEFAULT 'user',
        "permissions" jsonb,
        "status" character varying NOT NULL DEFAULT 'ACTIVE',
        "granted_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expires_date" TIMESTAMP,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" integer,
        "updated_by" integer,
        CONSTRAINT "PK_auth_user_applications" PRIMARY KEY ("user_app_id"),
        CONSTRAINT "UQ_auth_user_applications_user_app" UNIQUE ("user_id", "app_id"),
        CONSTRAINT "CHK_auth_user_applications_status" CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'))
      )
    `);

    // Add foreign keys
    await queryRunner.query(`
      ALTER TABLE "auth_user_applications" 
      ADD CONSTRAINT "FK_auth_user_applications_user_id" 
      FOREIGN KEY ("user_id") REFERENCES "auth_users"("user_id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "auth_user_applications" 
      ADD CONSTRAINT "FK_auth_user_applications_app_id" 
      FOREIGN KEY ("app_id") REFERENCES "auth_applications"("app_id") ON DELETE CASCADE
    `);

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_applications_app_code" ON "auth_applications" ("app_code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_applications_status" ON "auth_applications" ("status")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_auth_users_username" ON "auth_users" ("username")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_users_email" ON "auth_users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_users_status" ON "auth_users" ("status")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_auth_user_applications_user_id" ON "auth_user_applications" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_user_applications_app_id" ON "auth_user_applications" ("app_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_user_applications_status" ON "auth_user_applications" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_auth_user_applications_permissions" ON "auth_user_applications" USING GIN ("permissions")`,
    );

    // Create view for easier querying
    await queryRunner.query(`
      CREATE VIEW "user_application_access" AS
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
      WHERE u.status = 'ACTIVE' AND ua.status = 'ACTIVE' AND a.status = 'ACTIVE'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop view
    await queryRunner.query(`DROP VIEW IF EXISTS "user_application_access"`);

    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "auth_user_applications" DROP CONSTRAINT "FK_auth_user_applications_app_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_user_applications" DROP CONSTRAINT "FK_auth_user_applications_user_id"`,
    );

    // Drop indexes
    await queryRunner.query(
      `DROP INDEX "IDX_auth_user_applications_permissions"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_auth_user_applications_status"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_user_applications_app_id"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_user_applications_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_users_status"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_users_username"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_applications_status"`);
    await queryRunner.query(`DROP INDEX "IDX_auth_applications_app_code"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "auth_user_applications"`);
    await queryRunner.query(`DROP TABLE "auth_users"`);
    await queryRunner.query(`DROP TABLE "auth_applications"`);
  }
}
