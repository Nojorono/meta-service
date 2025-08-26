import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const setupSwagger = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const logger = new Logger();

  const docName: string = configService.get<string>('doc.name');
  const docDesc: string = configService.get<string>('doc.description');
  const docVersion: string = configService.get<string>('doc.version');
  const docPrefix: string = configService.get<string>('doc.prefix');

  const documentBuild = new DocumentBuilder()
    .setTitle(docName)
    .setDescription(docDesc)
    .setVersion(docVersion)
    .addServer('https://api.kcsi.id/service-meta', 'Production (via Kong Gateway)')
    .addServer('http://localhost:9003', 'Development (Direct)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token (without Bearer prefix)',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentBuild, {
    deepScanRoutes: true,
    include: [], // Include all modules by default
  });
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      displayOperationId: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      filter: true,
    },
    customCss: `
      .swagger-ui .auth-btn-wrapper .btn-auth {
        display: inline-block;
        margin: 0 10px 0 0;
        padding: 4px 23px;
        text-decoration: none;
        color: #3b4151;
        border: 1px solid #888;
        border-radius: 4px;
        background: transparent;
        font-family: Titillium Web,sans-serif;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
      .swagger-ui .auth-container .auth-btn-wrapper {
        display: flex;
        padding: 10px 0;
        justify-content: center;
      }
      .swagger-ui .auth-container h4 {
        margin: 5px 0 5px 0;
      }
      .swagger-ui .auth-container input[type=text] {
        width: 100%;
        margin: 5px 0;
      }
    `,
  };
  SwaggerModule.setup(docPrefix, app, document, {
    explorer: true,
    customSiteTitle: docName,
    ...customOptions,
  });
  logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');
};
