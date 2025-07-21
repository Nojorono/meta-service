import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Testing database connection...');
console.log('Host:', process.env.PSQL_HOST);
console.log('Port:', process.env.PSQL_PORT);
console.log('User:', process.env.PSQL_USER);
console.log('Database:', process.env.PSQL_NAME);

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PSQL_HOST || 'localhost',
  port: parseInt(process.env.PSQL_PORT || '5432'),
  username: process.env.PSQL_USER || 'api_mgmt_user',
  password: process.env.PSQL_PASSWORD || 'api_mgmt_password',
  database: process.env.PSQL_NAME || 'api_mgmt',
});

async function testConnection() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
