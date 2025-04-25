import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'meta',
    env: process.env.APP_ENV ?? 'staging',
    versioning: {
      enable: process.env.HTTP_VERSIONING_ENABLE === 'true',
      prefix: 'v',
      version: process.env.HTTP_VERSION ?? '1',
    },
    globalPrefix: '/api',
    http: {
      enable: process.env.HTTP_ENABLE === 'true',
      host: process.env.HTTP_HOST ?? '0.0.0.0',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 9000,
    },
  }),
);
