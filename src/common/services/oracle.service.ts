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

  constructor(private configService: ConfigService) {}

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

    // Validate credentials
    if (!dbPassword || dbPassword.length > 128) {
      this.logger.error(`Invalid password: length=${dbPassword?.length}`);
      return;
    }

    const connectString = `${dbHost}:${dbPort}/${dbSid}`;
    this.logger.log(`Connecting to Oracle: ${connectString} as ${dbUser}`);

    // Strategy 1: Try Thin mode first (faster, no library dependencies)
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

      // Check if it's the password verifier issue
      if (
        thinError.message.includes('NJS-116') ||
        thinError.message.includes('password verifier')
      ) {
        this.logger.log(
          'Password verifier type not supported in Thin mode, trying Thick mode...',
        );

        // Strategy 2: Fallback to Thick mode for password compatibility
        try {
          this.logger.log('Initializing Thick mode...');
          await oracleClientSingleton.initialize();

          await this.createPoolWithMode('thick', {
            user: dbUser,
            password: dbPassword,
            connectString,
          });
          this.logger.log('✅ Thick mode connection successful');
          return;
        } catch (thickError) {
          this.logger.error(`❌ Thick mode also failed: ${thickError.message}`);

          // Strategy 3: Try alternative connection approaches
          await this.tryAlternativeConnections(
            dbUser,
            dbPassword,
            dbHost,
            dbPort,
            dbSid,
          );
        }
      } else {
        this.logger.error(
          `❌ Thin mode failed with non-verifier error: ${thinError.message}`,
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
    try {
      this.logger.log('Getting connection from Oracle pool...');
      const connection = await this.pool.getConnection();
      this.logger.log('Oracle connection acquired successfully');
      return connection;
    } catch (error) {
      this.logger.error(
        `Error getting Oracle connection from pool: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async executeQuery(
    query: string,
    params: any[] = [],
  ): Promise<{ metadata: oracledb.Metadata<any>[]; rows: any[] }> {
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
}
