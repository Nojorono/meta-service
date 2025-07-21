import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class PostgreSQLService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgreSQLService.name);
  private pool: Pool;

  async onModuleInit(): Promise<void> {
    await this.createPool();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('PostgreSQL connection pool closed');
    }
  }

  private async createPool(): Promise<void> {
    try {
      this.logger.log('Initializing PostgreSQL Service...');

      // Safely extract and validate password
      const rawPassword = process.env.PSQL_PASSWORD;
      let password = '';

      if (rawPassword) {
        // Remove any quotes if present and ensure it's a string
        password = String(rawPassword).replace(/^["']|["']$/g, '');
      }

      const config = {
        host: process.env.PSQL_HOST || 'localhost',
        port: parseInt(process.env.PSQL_PORT || '5432'),
        database: process.env.PSQL_NAME || 'api_mgmt',
        user: process.env.PSQL_USER || 'api_mgmt',
        password: password,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
        maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
      };

      // Debug logging (safe - no password displayed)
      this.logger.debug(
        `PostgreSQL config: ${config.host}:${config.port}/${config.database} as ${config.user}`,
      );
      this.logger.debug(
        `Password type: ${typeof config.password}, length: ${config.password.length}`,
      );

      this.pool = new Pool(config);

      // Test connection
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();

      this.logger.log(`PostgreSQL connection pool created successfully`);
      this.logger.log(
        `Connected to: ${config.host}:${config.port}/${config.database} as ${config.user}`,
      );
      this.logger.log(`Database time: ${result.rows[0].now}`);
    } catch (error) {
      this.logger.error('Failed to create PostgreSQL connection pool:', error);
      throw error;
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    let client: PoolClient;
    try {
      client = await this.pool.connect();
      const start = Date.now();

      // Convert parameters to PostgreSQL format (replace ? with $1, $2, etc.)
      let pgQuery = query;
      const pgParams = params;

      // If using Oracle-style parameters (?), convert to PostgreSQL ($1, $2, etc.)
      if (query.includes('?')) {
        let paramIndex = 1;
        pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
      }

      const result = await client.query(pgQuery, pgParams);
      const duration = Date.now() - start;

      this.logger.debug(
        `Executed query in ${duration}ms: ${pgQuery.substring(0, 100)}${pgQuery.length > 100 ? '...' : ''}`,
      );

      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
        command: result.command,
        oid: result.oid,
        fields: result.fields,
      };
    } catch (error) {
      this.logger.error('Query execution failed:', {
        query: query.substring(0, 200),
        params,
        error: error.message,
      });
      throw error;
    } finally {
      if (client!) {
        client.release();
      }
    }
  }

  async executeTransaction(
    queries: Array<{ query: string; params?: any[] }>,
  ): Promise<QueryResult[]> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const results: QueryResult[] = [];

      for (const { query, params = [] } of queries) {
        // Convert parameters if needed
        let pgQuery = query;
        if (query.includes('?')) {
          let paramIndex = 1;
          pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
        }

        const result = await client.query(pgQuery, params);
        results.push({
          rows: result.rows,
          rowCount: result.rowCount || 0,
          command: result.command,
          oid: result.oid,
          fields: result.fields,
        });
      }

      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.executeQuery('SELECT 1 as test');
      return result.rows.length > 0;
    } catch (error) {
      this.logger.error('Connection test failed:', error);
      return false;
    }
  }

  getPool(): Pool {
    return this.pool;
  }
}
