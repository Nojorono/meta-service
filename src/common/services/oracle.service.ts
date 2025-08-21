import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { oracleClientSingleton } from './oracle-client.singleton';

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | undefined;
  private readonly logger = new Logger(OracleService.name);

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    this.logger.log('Initializing Oracle Service with hybrid mode...');

    // Set timezone to avoid issues
    process.env.ORA_SDTZ = 'UTC';

    await this.initializeWithHybridMode();
  }

  private async initializeWithHybridMode() {
    const dbUser = this.configService.get<string>('ORACLE_DATABASE_USERNAME');
    const dbHost = this.configService.get<string>('ORACLE_DATABASE_HOST');
    const dbPort = this.configService.get<string>('ORACLE_DATABASE_PORT');
    const dbSid = this.configService.get<string>('ORACLE_DATABASE_SID');
    const dbPassword = this.configService.get<string>(
      'ORACLE_DATABASE_PASSWORD',
    );

    // Validate all required environment variables
    if (!dbUser || !dbHost || !dbPort || !dbSid || !dbPassword) {
      this.logger.error(
        'Missing required Oracle database environment variables',
      );
      this.logger.error(`User: ${dbUser ? 'SET' : 'MISSING'}`);
      this.logger.error(`Host: ${dbHost ? 'SET' : 'MISSING'}`);
      this.logger.error(`Port: ${dbPort ? 'SET' : 'MISSING'}`);
      this.logger.error(`SID: ${dbSid ? 'SET' : 'MISSING'}`);
      this.logger.error(`Password: ${dbPassword ? 'SET' : 'MISSING'}`);
      return;
    }

    // Validate credentials
    if (dbPassword.length > 128) {
      this.logger.error(`Invalid password: length=${dbPassword.length}`);
      return;
    }

    const connectString = `${dbHost}:${dbPort}/${dbSid}`;
    this.logger.log(`Connecting to Oracle: ${connectString} as ${dbUser}`);

    // Strategy 1: Try Thick mode first for better compatibility
    try {
      this.logger.log('Attempting Thick mode connection...');
      await oracleClientSingleton.initialize();

      await this.createPoolWithMode('thick', {
        user: dbUser,
        password: dbPassword,
        connectString,
      });
      this.logger.log('✅ Thick mode connection successful');
      return;
    } catch (thickError) {
      this.logger.warn(`❌ Thick mode failed: ${thickError.message}`);

      // Strategy 2: Try Thin mode as fallback
      try {
        this.logger.log('Attempting Thin mode connection...');
        await this.createPoolWithMode('thin', {
          user: dbUser,
          password: dbPassword,
          connectString,
        });
        this.logger.log('✅ Thin mode connection successful');
        return;
      } catch (thinError) {
        this.logger.warn(`❌ Thin mode failed: ${thinError.message}`);

        // Strategy 3: Try alternative connection approaches
        await this.tryAlternativeConnections(
          dbUser,
          dbPassword,
          dbHost,
          dbPort,
          dbSid,
        );
      }
    }
  }

  private async createPoolWithMode(
    mode: 'thin' | 'thick' | 'fallback',
    config: any,
  ) {
    const poolConfig = {
      ...config,
      poolIncrement: 1,
      poolMax: 5,
      poolMin: 1,
      poolTimeout: 60,
      connectTimeout: 30,
      queueMax: 50,
      queueTimeout: 10000,
    };

    // Test connection before creating pool
    try {
      this.logger.log(`Testing ${mode} mode connection...`);
      const testConnection = await oracledb.getConnection(config);
      await testConnection.execute('SELECT 1 FROM DUAL');
      await testConnection.close();
      this.logger.log(`✅ ${mode} mode connection test successful`);
    } catch (error) {
      this.logger.error(
        `❌ ${mode} mode connection test failed: ${error.message}`,
      );
      throw error;
    }

    this.pool = await oracledb.createPool(poolConfig);
    this.logger.log(`Oracle pool created in ${mode} mode`);
  }

  private async tryAlternativeConnections(
    user: string,
    password: string,
    host: string,
    port: string,
    sid: string,
  ) {
    const alternatives = [
      `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${host})(PORT=${port}))(CONNECT_DATA=(SID=${sid})))`,
      `${host}:${port}:${sid}`,
      `//${host}:${port}/${sid}`,
    ];

    for (const connectString of alternatives) {
      try {
        this.logger.log(
          `Trying alternative connection string: ${connectString.substring(0, 50)}...`,
        );
        await this.createPoolWithMode('fallback', {
          user,
          password,
          connectString,
        });
        this.logger.log('✅ Alternative connection successful');
        return;
      } catch (error) {
        this.logger.warn(`❌ Alternative failed: ${error.message}`);
      }
    }

    this.logger.error('❌ All connection strategies failed');
    this.logger.warn('Service will start without Oracle connection');
  }

  async onModuleDestroy() {
    if (this.pool) {
      try {
        await this.pool.close(10);
        this.logger.log('Oracle connection pool closed successfully');
      } catch (error) {
        this.logger.error(
          `Error closing Oracle connection pool: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  async getConnection(): Promise<oracledb.Connection> {
    if (!this.pool) {
      throw new Error(
        'Oracle connection pool is not available. Database connection failed during initialization.',
      );
    }

    let retries = 3;
    while (retries > 0) {
      try {
        this.logger.log(
          `Getting connection from Oracle pool... (attempts left: ${retries})`,
        );
        const connection = await this.pool.getConnection();
        this.logger.log('Oracle connection acquired successfully');
        return connection;
      } catch (error) {
        retries--;
        this.logger.error(
          `Error getting Oracle connection from pool: ${error.message} (attempts left: ${retries})`,
          error.stack,
        );

        if (retries === 0) {
          throw error;
        }

        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error('Failed to get Oracle connection after all retries');
  }

  async executeQuery(
    query: string,
    params: any[] = [],
  ): Promise<{ metadata: oracledb.Metadata<any>[]; rows: any[] }> {
    if (!this.pool) {
      throw new Error(
        'Oracle connection pool is not available. Please check database configuration.',
      );
    }

    let connection: oracledb.Connection;
    try {
      const truncatedQuery =
        query.length > 200 ? query.substring(0, 200) + '...' : query;
      this.logger.log(`Executing Oracle query: ${truncatedQuery}`);
      this.logger.log(`Query parameters: ${JSON.stringify(params || [])}`);

      connection = await this.getConnection();

      // Execute the query
      this.logger.log('Executing Oracle query...');
      const result = await connection.execute(query, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // Return results as JavaScript objects
        autoCommit: true,
      });

      const rowCount = result.rows?.length || 0;
      this.logger.log(
        `Query executed successfully. Rows returned: ${rowCount}`,
      );

      return {
        metadata: result.metaData,
        rows: result.rows || [],
      };
    } catch (error) {
      this.logger.error(
        `Error executing Oracle query: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
          this.logger.log('Oracle connection closed after query');
        } catch (error) {
          this.logger.error(
            `Error closing Oracle connection: ${error.message}`,
            error.stack,
          );
        }
      }
    }
  }

  isConnected(): boolean {
    return this.pool !== undefined;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.pool) {
      return false;
    }

    try {
      const connection = await this.pool.getConnection();
      await connection.execute('SELECT 1 FROM DUAL');
      await connection.close();
      return true;
    } catch (error) {
      this.logger.error(`Oracle health check failed: ${error.message}`);
      return false;
    }
  }

  async reinitialize(): Promise<void> {
    this.logger.log('Reinitializing Oracle connection...');
    if (this.pool) {
      try {
        await this.pool.close(10);
        this.logger.log('Closed existing Oracle pool');
      } catch (error) {
        this.logger.warn(`Error closing existing pool: ${error.message}`);
      }
    }

    await this.initializeWithHybridMode();
  }
}
