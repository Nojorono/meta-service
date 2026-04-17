import { registerAs } from '@nestjs/config';

export default registerAs(
  'doc',
  (): Record<string, any> => {
    const httpPort = process.env.HTTP_PORT
      ? Number.parseInt(process.env.HTTP_PORT, 10)
      : 9000;
    const rawHost = process.env.HTTP_HOST ?? 'localhost';
    const swaggerHost =
      rawHost === '0.0.0.0' || rawHost === '::' ? 'localhost' : rawHost;
    const directServerUrl =
      process.env.SWAGGER_DIRECT_SERVER_URL?.trim() ||
      `http://${swaggerHost}:${httpPort}`;

    return {
      name: `${process.env.APP_NAME} APIs Specification`,
      description: 'Auth APIs description',
      version: '1.0',
      prefix: '/docs',
      directServerUrl,
    };
  },
);
