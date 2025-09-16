import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { setupSwagger } from './swagger';
import { AuthGuard } from './common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

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
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix(globalPrefix);
  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
      prefix: versioningPrefix,
    });
  }
  // Set up global pipes and guards
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set up global auth guard
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new AuthGuard(reflector, jwtService));

  // Microservices configuration for internal WMS access
  const microservices = [
    {
      name: 'META_SERVICE_MAIN',
      queue: configService.get('rmq.metaService') || 'meta_service_queue',
    },
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
      name: 'EMPLOYEE_SERVICE',
      queue: configService.get('rmq.employee'),
    },
    {
      name: 'GEOTREE_SERVICE',
      queue: configService.get('rmq.geotree'),
    },
    {
      name: 'SALES_ORDER_SERVICE',
      queue: configService.get('rmq.salesOrder') || 'sales_order_queue',
    },
    {
      name: 'PURCHASE_ORDER_SERVICE',
      queue: configService.get('rmq.purchaseOrder') || 'purchase_order_queue',
    },
    {
      name: 'WAREHOUSE_SERVICE',
      queue: configService.get('rmq.warehouse') || 'warehouse_queue',
    },
    {
      name: 'SALES_ITEM_SERVICE',
      queue: configService.get('rmq.salesItem') || 'sales_item_queue',
    },
    {
      name: 'SALESMAN_SERVICE',
      queue: configService.get('rmq.salesman') || 'salesman_queue',
    },
    {
      name: 'PROVINCE_SERVICE',
      queue: configService.get('rmq.province') || 'province_queue',
    },
    {
      name: 'CITY_SERVICE',
      queue: configService.get('rmq.city') || 'city_queue',
    },
    {
      name: 'DISTRICT_SERVICE',
      queue: configService.get('rmq.district') || 'district_queue',
    },
    {
      name: 'SUB_DISTRICT_SERVICE',
      queue: configService.get('rmq.subDistrict') || 'sub_district_queue',
    },
    {
      name: 'ORGANIZATION_SERVICE',
      queue: configService.get('rmq.organization') || 'organization_queue',
    },
    {
      name: 'POSITION_SERVICE',
      queue: configService.get('rmq.position') || 'position_queue',
    },
    {
      name: 'SUPPLIER_SERVICE',
      queue: configService.get('rmq.supplier') || 'supplier_queue',
    },
    {
      name: 'SALES_ITEM_CONVERSION_SERVICE',
      queue:
        configService.get('rmq.salesItemConversion') ||
        'sales_item_conversion_queue',
    },
    {
      name: 'RECEIPT_METHOD_SERVICE',
      queue: configService.get('rmq.receiptMethod') || 'receipt_method_queue',
    },
    {
      name: 'SALES_ACTIVITY_SERVICE',
      queue: configService.get('rmq.salesActivity') || 'sales_activity_queue',
    },
    {
      name: 'USER_DMS_SERVICE',
      queue: configService.get('rmq.userDms') || 'user_dms_queue',
    },
    {
      name: 'PRICE_LIST_SERVICE',
      queue: configService.get('rmq.priceList') || 'price_list_queue',
    },
    {
      name: 'ITEM_LIST_SERVICE',
      queue: configService.get('rmq.itemList') || 'item_list_queue',
    },
    {
      name: 'ACTUAL_FPPR_SERVICE',
      queue: configService.get('rmq.actualFppr') || 'actual_fppr_queue',
    },
    {
      name: 'AR_RECEIPTS_SERVICE',
      queue: configService.get('rmq.arReceipts') || 'ar_receipts_queue',
    },
    {
      name: 'MOVE_ORDER_SERVICE',
      queue: configService.get('rmq.moveOrder') || 'move_order_queue',
    },
    {
      name: 'WEEK_SALES_SERVICE',
      queue: configService.get('rmq.weekSales') || 'week_sales_queue',
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
