import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';

@Injectable()
export class TypeormService implements OnModuleInit {
  private dataSource: DataSource;
  private readonly databaseType: string;

  constructor(private readonly configService: ConfigService) {
    this.databaseType =
      this.configService.get<string>('DATABASE_TYPE') || 'oracle';
    this.dataSource = new DataSource({
      type: 'oracle',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: parseInt(
        this.configService.get<string>('DATABASE_PORT') || '1541',
        10,
      ),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      sid: this.configService.get<string>('DATABASE_SID'), // or use serviceName if needed
      connectString: this.configService.get<string>('DATABASE_CONNECT_STRING'), // optional
      schema: this.configService.get<string>('DATABASE_SCHEMA'),
      // Add entities and other TypeORM options as needed
    });
  }

  async onModuleInit() {
    if (this.databaseType === 'oracle') {
      oracledb.initOracleClient();
    }
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
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
        },
      };
    }
  }
}
