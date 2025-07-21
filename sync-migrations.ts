import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PSQL_HOST || 'localhost',
  port: parseInt(process.env.PSQL_PORT || '5432'),
  username: process.env.PSQL_USER || 'api_mgmt_user',
  password: process.env.PSQL_PASSWORD || 'api_mgmt_password',
  database: process.env.PSQL_NAME || 'api_mgmt',
});

async function markMigrationsAsExecuted() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');

    // Mark the CreateAuthTables migration as executed
    const createTablesMigration = {
      timestamp: 1721552400000,
      name: 'CreateAuthTables1721552400000',
    };

    // Mark the SeedAuthData migration as executed
    const seedDataMigration = {
      timestamp: 1721552500000,
      name: 'SeedAuthData1721552500000',
    };

    // Insert migration records
    await dataSource.query(
      'INSERT INTO typeorm_migrations (timestamp, name) VALUES ($1, $2)',
      [createTablesMigration.timestamp, createTablesMigration.name],
    );

    await dataSource.query(
      'INSERT INTO typeorm_migrations (timestamp, name) VALUES ($1, $2)',
      [seedDataMigration.timestamp, seedDataMigration.name],
    );

    console.log('✅ Migrations marked as executed:');
    console.log(`  - ${createTablesMigration.name}`);
    console.log(`  - ${seedDataMigration.name}`);

    // Verify
    const migrations = await dataSource.query(
      'SELECT * FROM typeorm_migrations ORDER BY timestamp',
    );
    console.log('\n📋 All migrations in database:');
    migrations.forEach((migration: any) => {
      console.log(
        `  - ${migration.name} (${new Date(parseInt(migration.timestamp))})`,
      );
    });

    await dataSource.destroy();
    console.log(
      '\n🎉 Migration synchronization complete! Your existing database is now compatible with TypeORM.',
    );
  } catch (error) {
    console.error('❌ Migration sync failed:', error.message);
  }
}

markMigrationsAsExecuted();
