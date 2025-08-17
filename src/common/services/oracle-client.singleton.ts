import * as oracledb from 'oracledb';
import { Logger } from '@nestjs/common';

class OracleClientSingleton {
  private static instance: OracleClientSingleton;
  private initialized = false;
  private readonly logger = new Logger('OracleClient');

  private constructor() {}

  static getInstance(): OracleClientSingleton {
    if (!OracleClientSingleton.instance) {
      OracleClientSingleton.instance = new OracleClientSingleton();
    }
    return OracleClientSingleton.instance;
  }

  async initialize(libDir?: string): Promise<void> {
    if (this.initialized) {
      this.logger.log('Oracle client already initialized, skipping...');
      return;
    }

    try {
      if (libDir) {
        oracledb.initOracleClient({ libDir });
        this.logger.log(
          `Oracle client initialized successfully using libDir: ${libDir}`,
        );
      } else {
        oracledb.initOracleClient();
        this.logger.log('Oracle client initialized successfully using PATH');
      }
      this.initialized = true;
    } catch (err) {
      this.logger.warn(`Oracle client initialization failed: ${err.message}`);
      throw err;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const oracleClientSingleton = OracleClientSingleton.getInstance();
