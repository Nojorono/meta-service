import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';

import express, { Request, Response } from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express()),
    {
      cors: true,
    },
  );

  const configService = app.get(ConfigService);
  const expressApp = app.getHttpAdapter().getInstance();

  // add root message
  expressApp.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 200,
      message: `Message from ${configService.get('app.name')}`,
      data: {
        timestamp: new Date(),
      },
    });
  });

  const port: number = configService.get<number>('app.http.port');
  const host: string = configService.get<string>('app.http.host') || '0.0.0.0'; // This allows access from any IP
  const globalPrefix: string = configService.get<string>('app.globalPrefix');
  const versioningPrefix: string = configService.get<string>(
    'app.versioning.prefix',
  );
  const version: string = configService.get<string>('app.versioning.version');
  const versionEnable: string = configService.get<string>(
    'app.versioning.enable',
  );
  // Configure security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: false,
    }),
  );

  // Configure CORS
  app.enableCors({
    origin: true, // Use request origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    maxAge: 3600,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
      prefix: versioningPrefix,
    });
  }
  // Microservices configuration
  const microservices = [
    {
      name: 'AUTH_SERVICE',
      queue: configService.get('rmq.auth'),
    },
    {
      name: 'CUSTOMER_SERVICE',
      queue: configService.get('rmq.customer'),
    },
    {
      name: 'BRANCH_SERVICE',
      queue: configService.get('rmq.branch'),
    },
    {
      name: 'REGION_SERVICE',
      queue: configService.get('rmq.region'),
    },
    {
      name: 'SALESMAN_SERVICE',
      queue: configService.get('rmq.salesman'),
    },
  ];

  // Initialize all microservices
  for (const service of microservices) {
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get('rmq.uri')],
        queue: service.queue,
        queueOptions: {
          durable: false,
        },
        noAck: true,
        persistent: false,
        prefetchCount: 1,
        socketOptions: {
          heartbeatIntervalInSeconds: 5,
          reconnectTimeInSeconds: 5,
        },
      },
    });
    logger.log(
      `🚀 ${service.name} microservice initialized with queue: ${service.queue}`,
    );
  }

  setupSwagger(app);
  await app.startAllMicroservices();
  await app.listen(port, host);
  logger.log(
    `🚀 ${configService.get(
      'app.name',
    )} service started successfully on port ${port}`,
  );
}
bootstrap();
