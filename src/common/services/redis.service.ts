import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis.Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('Initializing Redis Service...');
    try {
      this.redisClient = new Redis.Redis({
        host: this.configService.get<string>('REDIS_HOST'),
        port: parseInt(this.configService.get<string>('REDIS_PORT')),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        db: parseInt(this.configService.get<string>('REDIS_DB')),
        retryStrategy: (times) => {
          // Exponential backoff for reconnection attempts
          const delay = Math.min(times * 50, 2000);
          this.logger.log(`Redis reconnecting in ${delay}ms...`);
          return delay;
        },
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Successfully connected to Redis');
      });

      this.redisClient.on('error', (error) => {
        this.logger.error(`Redis error: ${error.message}`, error.stack);
      });
    } catch (error) {
      this.logger.error(
        `Failed to initialize Redis: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Get data from cache
   * @param key Cache key
   * @returns Cached data or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(
        `Error getting from Redis cache: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Set data in cache with optional expiration
   * @param key Cache key
   * @param value Data to cache
   * @param ttlSeconds Time to live in seconds (optional)
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redisClient.set(key, stringValue, 'EX', ttlSeconds);
      } else {
        await this.redisClient.set(key, stringValue);
      }
    } catch (error) {
      this.logger.error(
        `Error setting Redis cache: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Delete a key from cache
   * @param key Cache key to delete
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(
        `Error deleting from Redis cache: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Delete multiple keys with a pattern (e.g., 'customer:*')
   * @param pattern Key pattern to match
   */
  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
        this.logger.log(
          `Deleted ${keys.length} keys matching pattern ${pattern}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error deleting keys by pattern: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Invalidate all customer-related caches
   */
  async invalidateCustomerCache(): Promise<void> {
    await this.deleteByPattern('customer:*');
  }
}
