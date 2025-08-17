import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { oracleClientSingleton } from './oracle-client.singleton';

@Injectable()
export class TypeormService implements OnModuleInit {
  private dataSource: DataSource;
  private readonly databaseType: string;
  private readonly logger = new Logger(TypeormService.name);

  constructor(private readonly configService: ConfigService) {
    this.databaseType =
      this.configService.get<string>('DATABASE_TYPE') || 'oracle';
  }

  async onModuleInit() {
    try {
      // Check if Oracle configuration is available
      const dbHost = this.configService.get<string>('ORACLE_DATABASE_HOST');
      const dbPort =
        this.configService.get<string>('ORACLE_DATABASE_PORT') || '1541';
      const dbUser = this.configService.get<string>('ORACLE_DATABASE_USERNAME');
      const dbPassword = this.configService.get<string>(
        'ORACLE_DATABASE_PASSWORD',
      );
      const dbSid = this.configService.get<string>('ORACLE_DATABASE_SID');
      const dbSchema = this.configService.get<string>('ORACLE_DATABASE_SCHEMA');

      // Log connection details (mask password for security)
      this.logger.debug(
        `TypeORM Oracle config: ${dbHost}:${dbPort}/${dbSid} as ${dbUser}`,
      );

      // Check if required values are present
      if (!dbHost || !dbUser || !dbPassword || !dbSid) {
        this.logger.warn(
          'Missing Oracle database configuration. TypeORM Oracle connection will not be initialized.',
        );
        return;
      }

      // Initialize Oracle client
      if (this.databaseType === 'oracle') {
        try {
          const oracleLibDir = this.configService.get<string>(
            'ORACLE_INSTANT_CLIENT_PATH',
          );
          await oracleClientSingleton.initialize(oracleLibDir);

          this.logger.log(
            'Oracle client initialized successfully in TypeORM service',
          );
        } catch (error) {
          this.logger.warn(
            `Failed to initialize Oracle client: ${error.message}`,
          );
          return;
        }
      }

      // Create DataSource
      this.dataSource = new DataSource({
        type: 'oracle',
        host: dbHost,
        port: parseInt(dbPort, 10),
        username: dbUser,
        password: dbPassword,
        sid: dbSid,
        schema: dbSchema,
      });

      // Initialize connection
      if (!this.dataSource.isInitialized) {
        try {
          await this.dataSource.initialize();
          this.logger.log(
            `TypeORM Oracle connection established to ${dbHost}:${dbPort}/${dbSid}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to initialize TypeORM Oracle connection: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error in TypeORM service initialization: ${error.message}`,
      );
    }
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      return {
        typeorm: {
          status: 'down',
          message: 'DataSource not initialized',
        },
      };
    }

    try {
      // For Oracle, a simple query is "SELECT 1 FROM DUAL"
      await this.dataSource.query('SELECT 1 FROM DUAL');
      return {
        typeorm: {
          status: 'up',
        },
      };
    } catch (e) {
      return {
        typeorm: {
          status: 'down',
          message: e.message,
        },
      };
    }
  }
}
