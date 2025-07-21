import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | undefined;
  private readonly logger = new Logger(OracleService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('Initializing Oracle Service...');
    // Initialize Oracle client
    try {
      // Try to initialize without libDir first (using PATH)
      oracledb.initOracleClient();
      this.logger.log('Oracle client initialized successfully using PATH');
    } catch (err) {
      // If PATH doesn't work, try with explicit libDir from environment variable
      const oracleLibDir = this.configService.get<string>(
        'ORACLE_INSTANT_CLIENT_PATH',
      );
      if (oracleLibDir) {
        try {
          oracledb.initOracleClient({ libDir: oracleLibDir });
          this.logger.log(
            `Oracle client initialized successfully using libDir: ${oracleLibDir}`,
          );
        } catch (libDirErr) {
          this.logger.warn(
            `Oracle client initialization failed with libDir: ${libDirErr.message}`,
          );
          this.logger.warn(
            'Please ensure Oracle Instant Client is in PATH or ORACLE_INSTANT_CLIENT_PATH is set correctly',
          );
        }
      } else {
        this.logger.warn(`Oracle client initialization note: ${err.message}`);
        this.logger.warn(
          'Consider adding Oracle Instant Client to PATH or set ORACLE_INSTANT_CLIENT_PATH environment variable',
        );
      }
    }

    // We'll set autoCommit in the executeQuery method directly

    // Create a connection pool
    try {
      const dbUser = this.configService.get<string>('ORACLE_DATABASE_USERNAME');
      const dbHost = this.configService.get<string>('ORACLE_DATABASE_HOST');
      const dbPort = this.configService.get<string>('ORACLE_DATABASE_PORT');
      const dbSid = this.configService.get<string>('ORACLE_DATABASE_SID');

      this.logger.log(
        `Creating Oracle connection pool to ${dbHost}:${dbPort}/${dbSid} as ${dbUser}`,
      );

      this.pool = await oracledb.createPool({
        user: dbUser,
        password: this.configService.get<string>('ORACLE_DATABASE_PASSWORD'),
        connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${dbHost})(PORT=${dbPort}))(CONNECT_DATA=(SID=${dbSid})))`,
        poolIncrement: 5,
        poolMax: 20,
        poolMin: 5,
        poolTimeout: 300,
        connectTimeout: 60, // 60 seconds timeout
        enableStatistics: true,
        queueMax: 500,
        queueTimeout: 30000, // 30 seconds queue timeout
      });
      this.logger.log('Oracle connection pool created successfully');
    } catch (error) {
      this.logger.error(
        `Error creating Oracle connection pool: ${error.message}`,
        error.stack,
      );
      this.logger.warn(
        'Oracle connection failed. Service will start without database connection.',
      );
      this.logger.warn(
        'Please check: 1) Database host/port accessibility, 2) Oracle Instant Client installation, 3) Network connectivity',
      );
      // Don't throw error, allow service to start without DB connection
      // throw error;
    }
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
