import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  AuthUser,
  AuthApplication,
  AuthUserApplication,
} from '../modules/auth/entities';

// Load environment variables
dotenv.config({ path: '.env.local' });

export default new DataSource({
  type: 'postgres',
  host: process.env.PSQL_HOST || 'localhost',
  port: parseInt(process.env.PSQL_PORT || '5432'),
  username: process.env.PSQL_USER || 'api_mgmt_user',
  password: process.env.PSQL_PASSWORD || 'api_mgmt_password',
  database: process.env.PSQL_NAME || 'api_mgmt',
  entities: [AuthUser, AuthApplication, AuthUserApplication],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
});
