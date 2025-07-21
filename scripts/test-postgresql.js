/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testPostgreSQLConnection() {
  console.log('🔍 Testing PostgreSQL Connection...\n');

  const config = {
    host: process.env.PSQL_HOST || 'localhost',
    port: parseInt(process.env.PSQL_PORT || '5432'),
    database: process.env.PSQL_NAME || 'api_mgmt',
    user: process.env.PSQL_USER || 'api_mgmt',
    password: process.env.PSQL_PASSWORD || '',
  };

  console.log('📋 Connection Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${'*'.repeat(config.password.length)}\n`);

  const pool = new Pool(config);

  try {
    // Test connection
    console.log('🔗 Attempting to connect...');
    const client = await pool.connect();

    // Get database info
    const versionResult = await client.query('SELECT version()');
    const timeResult = await client.query('SELECT NOW()');
    const dbNameResult = await client.query('SELECT current_database()');

    console.log('✅ Connection successful!\n');
    console.log('📊 Database Information:');
    console.log(
      `   Version: ${versionResult.rows[0].version.split(' ').slice(0, 2).join(' ')}`,
    );
    console.log(
      `   Current Database: ${dbNameResult.rows[0].current_database}`,
    );
    console.log(`   Server Time: ${timeResult.rows[0].now}`);

    // Check if auth tables exist
    console.log('\n🗃️  Checking authentication tables:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'auth_%'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('   Existing auth tables:');
      tablesResult.rows.forEach((row) => {
        console.log(`   ✓ ${row.table_name}`);
      });

      // Get sample data
      try {
        const usersCount = await client.query(
          'SELECT COUNT(*) FROM auth_users',
        );
        const appsCount = await client.query(
          'SELECT COUNT(*) FROM auth_applications',
        );
        const accessCount = await client.query(
          'SELECT COUNT(*) FROM auth_user_applications',
        );

        console.log('\n📈 Data Summary:');
        console.log(`   Users: ${usersCount.rows[0].count}`);
        console.log(`   Applications: ${appsCount.rows[0].count}`);
        console.log(`   User Access Records: ${accessCount.rows[0].count}`);
      } catch (err) {
        console.log('   ⚠️  Tables exist but may not have data yet');
      }
    } else {
      console.log('   ⚠️  No auth tables found. Run the setup script first.');
      console.log(
        '   📝 Execute: psql -h localhost -U api_mgmt -d api_mgmt -f database/setup_auth_postgresql.sql',
      );
    }

    client.release();

    console.log('\n🎉 PostgreSQL connection test completed successfully!');
  } catch (error) {
    console.log('❌ Connection failed!');
    console.error('   Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure PostgreSQL server is running');
      console.log('   2. Check if the host and port are correct');
      console.log('   3. Verify firewall settings');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('   1. Check username and password');
      console.log('   2. Verify user exists in PostgreSQL');
      console.log('   3. Check pg_hba.conf for authentication method');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('   1. Create the database first: CREATE DATABASE api_mgmt;');
      console.log('   2. Grant permissions to user');
    }
  } finally {
    await pool.end();
  }
}

testPostgreSQLConnection();
