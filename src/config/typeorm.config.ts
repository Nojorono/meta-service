import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  AuthUser,
  AuthApplication,
  AuthUserApplication,
} from '../modules/auth/entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PSQL_HOST || 'localhost',
  port: parseInt(process.env.PSQL_PORT || '5432'),
  username: process.env.PSQL_USER || 'api_mgmt_user',
  password: process.env.PSQL_PASSWORD || 'api_mgmt_password',
  database: process.env.PSQL_NAME || 'api_mgmt',
  entities: [AuthUser, AuthApplication, AuthUserApplication],
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: false,
};
